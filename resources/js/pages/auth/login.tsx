import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <div className="fixed inset-0 z-[99999] w-screen h-screen flex flex-col lg:flex-row bg-white font-sans overflow-y-auto selection:bg-gray-900 selection:text-white">
            <Head title="Log in" />
            {/* <PasskeyVerify /> */}

            {/* 🟦 BAGIAN KIRI: BRANDING (HITAM/NAVY TEGAS) */}
            <div className="lg:w-1/2 bg-gray-900 flex flex-col justify-center px-12 py-12 lg:px-24 relative overflow-hidden min-h-[320px] lg:min-h-screen">
                {/* Aksen Dekorasi */}
                <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gray-800 rounded-tl-full opacity-50"></div>

                <div className="relative z-10">
                    <span className="inline-block py-1 px-3 bg-blue-800 text-white text-xs font-bold uppercase tracking-widest mb-4">
                        Official Portal
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter mb-6">
                        Sistem <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                            Informasi
                        </span>{' '}
                        <br />
                        Sekolah
                    </h1>
                    <div className="w-20 h-2 bg-yellow-400 mb-6"></div>
                    <p className="text-gray-400 text-sm lg:text-base font-medium leading-relaxed max-w-md border-l-4 border-gray-700 pl-4">
                        Platform manajemen terpadu untuk administrasi kegiatan, perizinan, dan jurnal refleksi guru.
                    </p>
                </div>
            </div>

            {/* ⬜ BAGIAN KANAN: FORM LOGIN (PUTIH BERSIH) */}
            <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative">
                <div className="w-full max-w-md">
                    {/* Header Form */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">
                            Silakan Masuk
                        </h2>
                        <p className="text-gray-500 text-sm font-medium">
                            Masukkan kredensial akun guru atau staf Anda.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-600 p-4 text-green-800 text-sm font-bold shadow-sm uppercase tracking-wide">
                            ✅ {status}
                        </div>
                    )}

                    {/* Mengembalikan Mesin Form Handler Asli Lokal */}
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Input Email */}
                                <div>
                                    <Label htmlFor="email" className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2">
                                        Email Sekolah
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="nama@gmail.com"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm font-bold focus:bg-white focus:border-blue-900 focus:ring-0 transition-colors rounded-none placeholder-gray-400 focus-visible:ring-0"
                                    />
                                    <InputError message={errors.email} className="text-red-600 text-xs font-bold mt-1 uppercase" />
                                </div>

                                {/* Input Password */}
                                <div>
                                    <Label htmlFor="password" className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-2">
                                        Password
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 text-gray-900 text-sm font-bold focus:bg-white focus:border-blue-900 focus:ring-0 transition-colors rounded-none placeholder-gray-400 focus-visible:ring-0"
                                    />
                                    <InputError message={errors.password} className="text-red-600 text-xs font-bold mt-1 uppercase" />
                                </div>

                                {/* Remember & Forgot Password Link */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="rounded-none border-2 border-gray-400 data-[state=checked]:bg-gray-900 data-[state=checked]:text-white"
                                        />
                                        <Label htmlFor="remember" className="text-xs font-black text-gray-500 uppercase cursor-pointer select-none">
                                            Remember me
                                        </Label>
                                    </div>

                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-bold text-blue-700 hover:text-black uppercase border-b-2 border-transparent hover:border-black transition"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>

                                {/* Button Login */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    tabIndex={4}
                                    data-test="login-button"
                                    className="w-full bg-gray-900 text-white font-black py-6 px-4 uppercase tracking-widest hover:bg-blue-900 transition duration-300 shadow-lg rounded-none border-b-4 border-black hover:border-blue-950 flex items-center justify-center gap-2"
                                >
                                    {processing && <Spinner className="text-white" />}
                                    Masuk Sistem &rarr;
                                </Button>
                            </>
                        )}
                    </Form>

                    <div className="mt-10 pt-6 border-t-2 border-gray-100 text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide">
                            &copy; {new Date().getFullYear()} Sistem Informasi Sekolah. Versi 1.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

Login.layout = (page: any) => page;