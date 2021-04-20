// eslint-disable-next-line no-var
var idbKeyval

self.importScripts(['idb-key-val-min.js'])

self.addEventListener('sync', function (event) {
  if (event.tag === 'order-status-updates') {
    event.waitUntil(drainOrderStatusUpdates())
  }
})

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-orders') {
    event.waitUntil(pullOrders())
  }
})

async function drainOrderStatusUpdates() {
  /** @type {any[]} */
  const orderUpdates = (await idbKeyval.get('order-status-updates')) || []
  console.log(`Updating order statuses`, orderUpdates)

  const updates = orderUpdates.map((orderUpdate) =>
    fetch(
      `https://aqueous-ravine-18030.herokuapp.com/orders/${orderUpdate.orderId}?status=${orderUpdate.status}`,
      { method: 'POST' }
    )
  )

  await Promise.all(updates)

  await idbKeyval.set('order-status-updates', [])

  console.log(`Order statuses updated!`)
}

async function pullOrders() {
  console.log(`Pulling new orders`)

  const newOrdersResponse = await fetch(
    `https://aqueous-ravine-18030.herokuapp.com/orders`
  )

  const newOrders = await newOrdersResponse.json()

  await idbKeyval.set('orders', newOrders)

  console.log('Got new orders', newOrders)
}
