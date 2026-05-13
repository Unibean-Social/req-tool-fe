import { SignUpActions } from "./components/sign-up-actions";
import { SignUpCard } from "./components/sign-up-card";
import { SignUpMessage } from "./components/sign-up-message";

export default function SignUpPage() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col justify-center py-4">
        <SignUpCard>
          <div className="flex flex-col gap-8">
            <SignUpMessage />
            <SignUpActions />
          </div>
        </SignUpCard>
      </div>
    </div>
  );
}
