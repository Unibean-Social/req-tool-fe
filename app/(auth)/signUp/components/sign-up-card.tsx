/** Khung tiêu đề đăng ký — cùng hệ thống chữ với login. */
export function SignUpCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <header className="mb-10 space-y-2 text-left">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-[2.25rem] sm:leading-tight">
          Tạo tài khoản
        </h1>
        <p className="text-base text-muted-foreground">
          Bắt đầu với REQ-Bean9 — biểu mẫu đầy đủ sẽ được bật khi API sẵn sàng.
        </p>
      </header>
      {children}
    </div>
  );
}
