export function LoginCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <header className="mb-10 space-y-2 text-left">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-[2.25rem] sm:leading-tight">
          Chào mừng trở lại!
        </h1>
        <p className="text-base text-muted-foreground">Đăng nhập vào tài khoản của bạn</p>
      </header>
      {children}
    </div>
  );
}
