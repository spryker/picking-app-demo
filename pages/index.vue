<template>
  <a-row type="flex" justify="center">
    <a-col>
      <a-list :data-source="orders" item-layout="vertical">
        <a-list-item slot="renderItem" slot-scope="order">
          <a-list-item-meta>
            <NuxtLink slot="title" :to="'/order/' + order.id">
              Order #{{ order.order_reference }}
            </NuxtLink>
            <a-tag slot="description" :color="getOrderStatusColor(order)">
              {{ order.status }}
            </a-tag>
          </a-list-item-meta>
          <a-row>
            <a-col>
              <a-tag>
                Total:
                {{ order.grand_total_formatted }}
              </a-tag>
              <a-tag>
                Items:
                {{ order.number_of_items }}
              </a-tag>
              <a-tag>
                Created:
                {{ toReadableDate(order.created_at) }}
              </a-tag>
            </a-col>
          </a-row>
          <NuxtLink slot="actions" :to="'/order/' + order.id + '/edit'">
            Edit
          </NuxtLink>
          <a slot="actions" :href="'#'">Cancel</a>
        </a-list-item>
      </a-list>
    </a-col>
  </a-row>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Context } from '@nuxt/types'
import Vue from 'vue'
import { Order, OrderApiClient, OrderStatusUpdate } from '../api'

export default Vue.extend({
  async asyncData(ctx) {
    const orderApi = new OrderApiClient(ctx)

    const orders = await orderApi.getAll()
    const orderPendingStatusUpdates = await orderApi.getPendingStatusUpdates()

    return {
      orders,
      orderPendingStatusUpdates,
    }
  },
  data(ctx: Context): {} {
    const orderApi = new OrderApiClient(ctx)
    const updateOrdersBound = this.updateOrders.bind(this)

    return {
      orderApi,
      updateOrdersBound,
      dayMs: 24 * 60 * 60 * 1000,
      today: new Date(),
      longDateFormatter: new Intl.DateTimeFormat('en-DE', {
        dateStyle: 'long',
      }),
    }
  },
  head: () => ({
    title: 'Orders List',
  }),
  computed: ({
    todayStart() {
      const todayStart = new Date(this.today)
      todayStart.setHours(0, 0, 0, 0)
      return todayStart
    },
    todayEnd() {
      const todayEnd = new Date(this.today)
      todayEnd.setHours(23, 59, 59, 0)
      return todayEnd
    },
    yesterdayStart() {
      return new Date(this.todayStart.getTime() - this.dayMs)
    },
    thisWeekStart() {
      return new Date(this.todayStart.getTime() - 6 * this.dayMs)
    },
  } as any) as {
    todayStart(): Date
    todayEnd(): Date
    yesterdayStart(): Date
    thisWeekStart(): Date
  },
  mounted() {
    window.addEventListener('online', this.$data.updateOrdersBound)
    window.addEventListener('offline', this.$data.updateOrdersBound)
  },
  beforeDestroy() {
    window.removeEventListener('online', this.$data.updateOrdersBound)
    window.removeEventListener('offline', this.$data.updateOrdersBound)
  },
  created() {
    this.updateToday()

    if (!this.$isServer) {
      const scheduleDayChanged = () => {
        const nextDayMs = Math.abs(this.todayEnd.getTime() - Date.now())
        setTimeout(dayChanged, nextDayMs + 1000)
      }
      const dayChanged = () => {
        this.updateToday()
        scheduleDayChanged()
      }
      scheduleDayChanged()
    }
  },
  methods: {
    updateToday(date: Date | number = new Date()) {
      ;(this as any).today = new Date(date)
    },
    toReadableDate(dateStr: string): string {
      const date = new Date(dateStr)
      const dateTime = date.getTime()

      if (
        dateTime >= this.todayEnd.getTime() ||
        dateTime < this.thisWeekStart.getTime()
      ) {
        return (this as any).longDateFormatter.format(date)
      }

      if (dateTime >= this.todayStart.getTime()) {
        return 'Today'
      }

      if (dateTime >= this.yesterdayStart.getTime()) {
        return 'Yesterday'
      }

      return `${this.getDaysDiff(this.todayStart, date)} days ago`
    },
    getDaysDiff(from: Date, to: Date): number {
      return Math.ceil(
        Math.abs((to.getTime() - from.getTime()) / (this as any).dayMs)
      )
    },
    isOrderStatusUpdatePending(order: Order): boolean {
      const orderPendingStatusUpdates: OrderStatusUpdate[] = this.$data
        .orderPendingStatusUpdates

      return orderPendingStatusUpdates.some(
        (statusUpdate) => statusUpdate.orderId === order.id
      )
    },
    getOrderStatusColor(order: Order): string {
      return this.isOrderStatusUpdatePending(order) ? 'yellow' : 'green'
    },
    async updateOrders() {
      console.log('Updating orders...')
      const orderApi: OrderApiClient = this.$data.orderApi

      this.$data.orders = await orderApi.getAll()
      this.$data.orderPendingStatusUpdates = await orderApi.getPendingStatusUpdates()
    },
  },
})
</script>

<style scoped></style>
