/* eslint-disable no-useless-constructor */

import { Context } from '@nuxt/types'
import { OrderStatus } from './order-status'

export interface ReadableOrderStatus {
  title: string
  value: string
}

export class OrderStatusApiClient {
  constructor(private ctx: Context) {}

  getAll(): Promise<OrderStatus[]> {
    return Promise.resolve(Object.values(OrderStatus))
  }

  getAllReadable(): Promise<ReadableOrderStatus[]> {
    return Promise.resolve(
      Object.entries(OrderStatus).map(([title, value]) => ({ title, value }))
    )
  }
}
