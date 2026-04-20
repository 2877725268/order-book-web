import { useState, useEffect } from 'react'

const API_URL = 'https://order-book-server-production-291b.up.railway.app'

interface Order {
  id: string
  platform: string
  shop_name: string
  order_no: string
  product_name: string
  sale_amount: string
  shipping_fee: string
  packaging_fee: string
  status: string
  created_at: string
}

function App() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    platform: '淘宝',
    shop_name: '',
    order_no: '',
    product_name: '',
    sale_amount: '',
    shipping_fee: '0',
    packaging_fee: '0',
  })

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL + '/api/orders')
      const data = await res.json()
      setOrders(data.data || [])
    } catch (e) {
      console.error('获取订单失败', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch(API_URL + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setShowAddForm(false)
      setFormData({
        platform: '淘宝',
        shop_name: '',
        order_no: '',
        product_name: '',
        sale_amount: '',
        shipping_fee: '0',
        packaging_fee: '0',
      })
      fetchOrders()
    } catch (e) {
      console.error('添加订单失败', e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除吗？')) return
    try {
      await fetch(API_URL + '/api/orders/' + id, { method: 'DELETE' })
      fetchOrders()
    } catch (e) {
      console.error('删除失败', e)
    }
  }

  const totalSales = orders.reduce((sum, o) => sum + parseFloat(o.sale_amount || '0'), 0)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>订单记账系统</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>总销售额</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>¥{totalSales.toFixed(2)}</div>
        </div>
        <div style={{ background: '#fce4ec', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>订单数</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#c2185b' }}>{orders.length}</div>
        </div>
      </div>

      <button
        onClick={() => setShowAddForm(!showAddForm)}
        style={{ background: '#1976d2', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' }}
      >
        {showAddForm ? '取消' : '+ 添加订单'}
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <select value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <option>淘宝</option>
              <option>抖音</option>
            </select>
            <input type="text" placeholder="店铺名称" value={formData.shop_name} onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} required />
            <input type="text" placeholder="订单号" value={formData.order_no} onChange={(e) => setFormData({ ...formData, order_no: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} required />
            <input type="text" placeholder="产品名称" value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} required />
            <input type="number" step="0.01" placeholder="销售金额" value={formData.sale_amount} onChange={(e) => setFormData({ ...formData, sale_amount: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} required />
          </div>
          <button type="submit" style={{ marginTop: '16px', background: '#4caf50', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>保存</button>
        </form>
      )}

      {loading ? <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>平台</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>订单号</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>产品</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>金额</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{order.platform}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{order.order_no}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{order.product_name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee', color: '#4caf50', fontWeight: 'bold' }}>¥{order.sale_amount}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <button onClick={() => handleDelete(order.id)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
