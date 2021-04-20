/* eslint-disable camelcase */

import { OrderStatus } from '../order-status'

export interface Order {
  number_of_items: number
  order_reference: string
  created_at: string
  cusotmer_reference: number
  id: string
  grand_total_formatted: string
  status: OrderStatus
}

export interface OrderStatusUpdate {
  orderId: string
  status: OrderStatus
}
