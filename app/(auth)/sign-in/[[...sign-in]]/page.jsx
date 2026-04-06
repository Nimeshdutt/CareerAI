import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex items-end h-32 bg-gradient-to-r from-slate-900 via-slate-600 to-slate-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="/bg2.jpg"
            className="absolute inset-0 object-cover w-full h-full opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="#">
              <img src="/logo.png" width={200} height={200} />
            </a>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to CareerAI
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Elevate your career with intelligent mock interviews and
              personalized resume building. Transform your job search and stand
              out to employers with our advanced AI technology.
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 bg-black sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative block -mt-16 lg:hidden">
              <a
                className="inline-flex items-center justify-center text-blue-600 bg-white rounded-full size-16 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
                <img
                  src="/logo4.png"
                  alt="my responsive logo"
                  width={50}
                  height={50}
                />
              </a>

              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Welcome to CareerAI
              </h1>

              <p className="mt-4 mb-10 leading-relaxed text-justify text-gray-500">
                Elevate your career with intelligent mock interviews and
                personalized resume building. Transform your job search and
                stand out to employers with our advanced AI technology.
              </p>
            </div>

            <SignIn afterSignOutUrl="/dashboard" />
          </div>
        </main>
      </div>
    </section>
  );
}
