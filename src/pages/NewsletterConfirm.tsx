import React from 'react';
import { Header } from '../components/Header';
import { CheckCircle, Mail } from 'lucide-react';
import config from '../config.json';

export function NewsletterConfirm() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-6 relative">
                                    <CheckCircle className="h-16 w-16 text-green-500" />
                                    <Mail className="h-8 w-8 text-white absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1" />
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                    Inscription confirmée !
                                </h1>

                                <p className="text-gray-600 mb-4">
                                    Merci de vous être inscrit à la newsletter de {config.siteTitle}.
                                </p>

                                <p className="text-gray-600 mb-8">
                                    Vous allez recevoir un email de confirmation dans quelques instants.
                                    N'oubliez pas de vérifier vos spams si vous ne le trouvez pas dans votre boîte de réception.
                                </p>

                                <a
                                    href="/"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                >
                                    Retour à l'accueil
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-gray-600">
                        <p>© 2024 {config.siteTitle}. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}