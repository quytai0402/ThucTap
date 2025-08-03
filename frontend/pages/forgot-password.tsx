import React, { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Gửi API quên mật khẩu ở đây
    setSent(true);
  };

  if (sent) {
    // Giao diện hướng dẫn đặt lại mật khẩu
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <EnvelopeIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Kiểm tra email của bạn</h2>
          <p className="text-gray-600 mb-6">
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới <span className="font-medium">{email}</span>.<br />
            Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn.
          </p>
          <a href="/login" className="text-blue-600 hover:underline">Quay lại đăng nhập</a>
        </div>
      </div>
    );
  }

  // Giao diện quên mật khẩu
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <h2 className="text-2xl font-bold mb-1">Quên mật khẩu?</h2>
          <p className="text-gray-600 text-center text-sm">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
          <div className="relative mb-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <EnvelopeIcon className="h-5 w-5" />
            </span>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Gửi hướng dẫn đặt lại mật khẩu
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-600 hover:underline block mb-1">Quay lại đăng nhập</a>
          <span className="text-gray-500 text-sm">
            Chưa có tài khoản? <a href="/register" className="text-blue-600 hover:underline">Đăng ký ngay</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;