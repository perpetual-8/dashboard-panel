export async function getInventory() {
  const res = await fetch('/data/inventory.json')
  return res.json()
}

export async function getRevenue() {
  const res = await fetch('/data/revenue.json')
  return res.json()
}
