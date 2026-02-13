import { prisma } from '@/lib/prisma'; // Safe absolute import using alias

export const dynamic = 'force-dynamic'; // Ensure data is always fresh

export default async function DashboardPage() {
    const submissions = await prisma.publicForm.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-500 border border-gray-200">
                    Total Submissions: <span className="font-bold text-gray-900">{submissions.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Form Submissions</h2>
                    <p className="text-sm text-gray-500">Data from the public test form.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No submissions found.
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{sub.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{sub.email}</td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{sub.message}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(sub.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
