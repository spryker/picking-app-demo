<template>
  <a-row type="flex" justify="center">
    <a-col>
      <a-list :data-source="mockOrders" item-layout="vertical">
        <a-list-item slot="renderItem" slot-scope="order">
          <a-list-item-meta>
            <NuxtLink slot="title" :to="'/order/' + order.id">
              Order #{{ order.order_reference }}
            </NuxtLink>
            <a-tag slot="description" color="green">
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
import Vue from 'vue'

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
  async asyncData({ $axios }) {
    const orders = await $axios.$get<Order[]>(`/orders`)

    return { orders }
  },
  data: () => ({
    dayMs: 24 * 60 * 60 * 1000,
    today: new Date(),
    longDateFormatter: new Intl.DateTimeFormat('en-DE', {
      dateStyle: 'long',
    }),
    mockOrders: [
      {
        id: 'DE_123456789',
        created_at: '2021-03-23T13:42:00+0000',
        order_reference: 'DE_123456789',
        cusotmer_reference: 0,
        number_of_items: 5,
        grand_total_formatted: '$25.41',
        status: 'ready for picking',
      },
      {
        id: 'DE_14242522',
        created_at: '2021-03-30T15:52:20+0000',
        order_reference: 'DE_14242522',
        cusotmer_reference: 0,
        number_of_items: 2,
        grand_total_formatted: '$16.30',
        status: 'ready for delivery',
      },
    ],
  }),
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
      this.today = new Date(date)
    },
    toReadableDate(dateStr: string): string {
      const date = new Date(dateStr)
      const dateTime = date.getTime()

      if (
        dateTime >= this.todayEnd.getTime() ||
        dateTime < this.thisWeekStart.getTime()
      ) {
        return this.longDateFormatter.format(date)
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
      return Math.ceil(Math.abs((to.getTime() - from.getTime()) / this.dayMs))
    },
  },
})
</script>

<style scoped></style>
