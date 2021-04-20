import { OrderStatus } from '../order-status'
import { Order } from './order'

export const mockOrders: Order[] = [
  {
    id: 'DE_123456789',
    created_at: '2021-03-23T13:42:00+0000',
    order_reference: 'DE_123456789',
    cusotmer_reference: 0,
    number_of_items: 5,
    grand_total_formatted: '$25.41',
    status: OrderStatus.ReadyForPicking,
  },
  {
    id: 'DE_14242522',
    created_at: '2021-03-30T15:52:20+0000',
    order_reference: 'DE_14242522',
    cusotmer_reference: 0,
    number_of_items: 2,
    grand_total_formatted: '$16.30',
    status: OrderStatus.ReadyForDelivery,
  },
]
