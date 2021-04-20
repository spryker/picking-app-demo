/* eslint-disable no-useless-constructor */
import { Context } from '@nuxt/types'
import { get, set } from 'idb-keyval'

import { OrderStatus } from '../order-status'
import { Order, OrderStatusUpdate } from './order'

export class OrderApiClient {
  constructor(private ctx: Context) {
    this.registerOrdersUpdates()
  }

  async getOrderById(orderId: string): Promise<Order | undefined> {
    if (this.isOfflineClient()) {
      const orders = await this.getOfflineOrders()

      return orders.find((order) => order.id === orderId)
    }

    const order$ = this.ctx.$config.useApiMocks
      ? import('./order-mocks').then(({ mockOrders }) => mockOrders[0])
      : this.ctx.$axios.$get<Order>(`/orders/${orderId}`)

    return order$
  }

  async getAll(): Promise<Order[]> {
    if (this.isOfflineClient()) {
      const orders = await this.getOfflineOrders()

      return orders
    }

    const orders$ = this.ctx.$config.useApiMocks
      ? import('./order-mocks').then(({ mockOrders }) => mockOrders)
      : this.ctx.$axios.$get<Order[]>(`/orders`)

    const orders = await orders$

    this.saveOfflineOrders(orders)

    return orders
  }

  async updateStatus(order: Order, status: OrderStatus): Promise<boolean> {
    if (this.isOfflineClient()) {
      await this.scheduleStatusUpdate(order, status)
      await this.updateStatusOffline(order, status)
      return Promise.resolve(true)
    }

    await this.ctx.$axios.$post<void>(`/orders/${order.id}?status=${status}`)
    await this.updateStatusOffline(order, status)

    return Promise.resolve(true)
  }

  async getPendingStatusUpdates(): Promise<OrderStatusUpdate[]> {
    const orderUpdates = await this.getOffline<OrderStatusUpdate[]>(
      'order-status-updates',
      []
    )

    return orderUpdates
  }

  private async updateStatusOffline(order: Order, status: OrderStatus) {
    const orders = await this.getOfflineOrders()

    const updatedOrders = orders.map((o) =>
      o.id === order.id ? { ...o, status } : o
    )

    await this.saveOfflineOrders(updatedOrders)

    order.status = status
  }

  private async scheduleStatusUpdate(order: Order, status: OrderStatus) {
    const orderUpdates = await this.getOffline<OrderStatusUpdate[]>(
      'order-status-updates',
      []
    )

    const newOrderUpdates: OrderStatusUpdate[] = [
      ...orderUpdates,
      { orderId: order.id, status },
    ]

    await this.saveOffline('order-status-updates', newOrderUpdates)
    await this.registerStatusUpdateSync()
  }

  private async registerStatusUpdateSync() {
    if (process.server) {
      return
    }

    const swRegistration = await navigator.serviceWorker.ready

    try {
      await swRegistration.sync.register('order-status-updates')
    } catch (e) {
      console.warn(
        'Background sync registration for order status update failed!',
        e
      )
    }
  }

  private async registerOrdersUpdates() {
    if (process.server) {
      return
    }

    const registration: any = await navigator.serviceWorker.ready

    try {
      await registration.periodicSync.register('update-orders', {
        minInterval: 2 * 60 * 1000, // Every 2 mins
      })
    } catch (e) {
      console.warn('Background sync registration for order updates failed!', e)
    }
  }

  private isOfflineClient() {
    return process.client && !window.navigator.onLine
  }

  private getOfflineOrders() {
    return this.getOffline<Order[]>('orders', [])
  }

  private saveOfflineOrders(orders: Order[]) {
    return this.saveOffline('orders', orders)
  }

  private async getOffline<T>(key: string, defaultVal: T): Promise<T> {
    if (process.server) {
      return Promise.resolve(defaultVal)
    }

    const value = await get<T>(key)

    return value ?? defaultVal
  }

  private async saveOffline<T>(key: string, orders: T) {
    if (process.server) {
      return
    }

    await set(key, orders)
  }
}
