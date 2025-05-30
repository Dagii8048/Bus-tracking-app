import React, { useState, useEffect } from "react";
import {
  paymentApi,
  Payment,
  CreatePaymentData,
  UpdatePaymentData,
} from "../../../services/api";
import { scheduleApi, Schedule } from "../../../services/api";

const PaymentManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<
    CreatePaymentData | UpdatePaymentData
  >({
    scheduleId: "",
    amount: 0,
    paymentMethod: "credit_card",
    status: "pending",
    transactionId: "",
    paymentDate: new Date().toISOString(),
  });

  useEffect(() => {
    fetchPayments();
    fetchSchedules();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await paymentApi.getPayments();
      setPayments(data);
    } catch (err) {
      setError("An error occurred while fetching payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const data = await scheduleApi.getSchedules();
      setSchedules(data);
    } catch (err) {
      setError("An error occurred while fetching schedules");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedPayment) {
        await paymentApi.updatePayment(
          selectedPayment.id,
          formData as UpdatePaymentData
        );
      } else {
        await paymentApi.createPayment(formData as CreatePaymentData);
      }
      setIsModalOpen(false);
      setSelectedPayment(null);
      setFormData({
        scheduleId: "",
        amount: 0,
        paymentMethod: "credit_card",
        status: "pending",
        transactionId: "",
        paymentDate: new Date().toISOString(),
      });
      fetchPayments();
    } catch (err) {
      setError("An error occurred while saving payment");
    }
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData({
      scheduleId: payment.scheduleId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      transactionId: payment.transactionId,
      paymentDate: payment.paymentDate,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (paymentId: string) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await paymentApi.deletePayment(paymentId);
        fetchPayments();
      } catch (err) {
        setError("An error occurred while deleting payment");
      }
    }
  };

  const handleStatusChange = async (
    paymentId: string,
    newStatus: "pending" | "completed" | "failed" | "refunded"
  ) => {
    try {
      await paymentApi.updatePaymentStatus(paymentId, newStatus);
      fetchPayments();
    } catch (err) {
      setError("An error occurred while updating payment status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Payment Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all payments in the system including their schedules,
            amounts, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setSelectedPayment(null);
              setFormData({
                scheduleId: "",
                amount: 0,
                paymentMethod: "credit_card",
                status: "pending",
                transactionId: "",
                paymentDate: new Date().toISOString(),
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add payment
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Schedule
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Payment Method
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Transaction ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Payment Date
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {payments.map((payment) => {
                    const schedule = schedules.find(
                      (s) => s.id === payment.scheduleId
                    );
                    return (
                      <tr key={payment.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {schedule
                            ? `${schedule.routeId} - ${new Date(
                                schedule.departureTime
                              ).toLocaleDateString()}`
                            : "Unknown Schedule"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {payment.paymentMethod
                            .replace("_", " ")
                            .toUpperCase()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <select
                            value={payment.status}
                            onChange={(e) =>
                              handleStatusChange(
                                payment.id,
                                e.target.value as
                                  | "pending"
                                  | "completed"
                                  | "failed"
                                  | "refunded"
                              )
                            }
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              payment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : payment.status === "failed"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {payment.transactionId}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(payment.paymentDate).toLocaleString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleEdit(payment)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(payment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedPayment ? "Edit Payment" : "Add New Payment"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="scheduleId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Schedule
                </label>
                <select
                  id="scheduleId"
                  value={formData.scheduleId}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduleId: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                >
                  <option value="">Select a schedule</option>
                  {schedules.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {schedule.routeId} -{" "}
                      {new Date(schedule.departureTime).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentMethod: e.target.value as
                        | "credit_card"
                        | "debit_card"
                        | "cash"
                        | "mobile_payment",
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="cash">Cash</option>
                  <option value="mobile_payment">Mobile Payment</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as
                        | "pending"
                        | "completed"
                        | "failed"
                        | "refunded",
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="transactionId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Transaction ID
                </label>
                <input
                  type="text"
                  id="transactionId"
                  value={formData.transactionId}
                  onChange={(e) =>
                    setFormData({ ...formData, transactionId: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="paymentDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment Date
                </label>
                <input
                  type="datetime-local"
                  id="paymentDate"
                  value={new Date(formData.paymentDate)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentDate: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                  required
                />
              </div>

              <div className="col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {selectedPayment ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
