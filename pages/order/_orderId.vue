<template>
  <div>
    <a-row>
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
            <a-tag color="green">
              {{ order.status }}
            </a-tag>
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
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from 'vue'
import { mockOrders } from '../mock-orders'

interface Order {
  number_of_items: number
  order_reference: string
  created_at: string
  cusotmer_reference: string
  id: string
  grand_total_formatted: string
  status: string
}

export default Vue.extend({
  async asyncData({ params, $axios, $config }) {
    const orderId = params.orderId
    const order = $config.useApiMocks
      ? mockOrders[0]
      : await $axios.$get<Order[]>(`/orders/${orderId}`)
    const title = `Order #${orderId}`

    return {
      order,
      orderId,
      title,
      backLink: '/',
    } as any
  },
  head() {
    return {
      title: (this as any).title,
    }
  },
})
</script>

<style scoped></style>
