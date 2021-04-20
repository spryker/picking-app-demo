<template>
  <div>
    <a-row v-if="order">
      <a-col>
        <a-descriptions :title="title" bordered>
          <a-descriptions-item label="Total">
            {{ order.grand_total_formatted }}
          </a-descriptions-item>
          <a-descriptions-item label="Items">
            {{ order.number_of_items }}
          </a-descriptions-item>
          <a-descriptions-item label="Order time">
            {{ order.created_at }}
          </a-descriptions-item>
          <a-descriptions-item label="Status" :span="3">
            <a-tag :color="getOrderStatusColor(order)">
              {{ order.status }}
            </a-tag>
            <a-select
              :value="order.status"
              :options="orderStatuses"
              style="width: 100%"
              @change="updateStatus"
            ></a-select>
          </a-descriptions-item>
          <a-descriptions-item label="Items">
            Item #1
            <br />
            Item #2
            <br />
            Item #3
            <br />
            Item #4
            <br />
            Item #5
          </a-descriptions-item>
        </a-descriptions>
      </a-col>
    </a-row>
    <a-row v-if="!order">
      <a-col>
        <h3>Order not found</h3>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Context } from '@nuxt/types'
import Vue from 'vue'
import {
  Order,
  OrderApiClient,
  OrderStatus,
  OrderStatusApiClient,
  OrderStatusUpdate,
} from '../../api'

export default Vue.extend({
  async asyncData(ctx) {
    const orderApi = new OrderApiClient(ctx)
    const orderStatusApi = new OrderStatusApiClient(ctx)
    const orderId = ctx.params.orderId

    const order = await orderApi.getOrderById(orderId)
    const orderStatuses = await orderStatusApi.getAllReadable()
    const orderPendingStatusUpdates = await orderApi.getPendingStatusUpdates()
    const title = `Order #${orderId}`

    return {
      order,
      orderId,
      title,
      backLink: '/',
      orderStatuses,
      orderPendingStatusUpdates,
    } as any
  },
  data(ctx: Context) {
    const orderApi = new OrderApiClient(ctx)
    const orderStatusApi = new OrderStatusApiClient(ctx)

    return {
      orderApi,
      orderStatusApi,
    }
  },
  head() {
    return {
      title: (this as any).title,
    }
  },
  methods: {
    async updateStatus(newStatus: OrderStatus) {
      const order: Order = this.$data.order
      const orderApi: OrderApiClient = this.$data.orderApi

      await orderApi.updateStatus(order, newStatus)

      this.$data.orderPendingStatusUpdates = await orderApi.getPendingStatusUpdates()
    },
    isOrderStatusUpdatePending(order: Order): boolean {
      const orderPendingStatusUpdates: OrderStatusUpdate[] = this.$data
        .orderPendingStatusUpdates

      return orderPendingStatusUpdates.some(
        (statusUpdate) => statusUpdate.orderId === order.id
      )
    },
    getOrderStatusColor(order: Order): string {
      return (this as any).isOrderStatusUpdatePending(order)
        ? 'yellow'
        : 'green'
    },
  },
})
</script>

<style scoped></style>
