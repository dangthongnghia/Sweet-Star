import prisma from '@/lib/prisma';
import { format } from 'date-fns';

async function getOrders() {
    // Include nested items
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { items: true }
    });
    // Serialize if needed, but in Server Components usually fine unless passing to client
    // To be safe with Decimal/Date types if passing to Client Componets (this is Server Component though)
    return orders;
}

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const orders = await getOrders();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Danh sách Đơn hàng</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order: any) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ...{order.id.toString().slice(-6)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                    <div className="text-sm text-gray-500">{order.phone}</div>
                                    <div className="text-xs text-gray-400">{order.address}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <ul className="text-sm text-gray-600 list-disc list-inside">
                                        {order.items.map((item: any) => (
                                            <li key={item.id} className={item.isCombo ? "font-semibold text-primary" : ""}>
                                                {item.name} x{item.quantity}
                                                {item.isCombo && " (+Công thức)"}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
