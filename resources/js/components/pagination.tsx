import { Link } from '@inertiajs/react';

export default function Pagination({ paginator }: { paginator: any }) {
    if (!paginator || paginator.last_page <= 1) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 border-t-4 border-gray-900 pt-8">
            {paginator.links.map((link: any, index: number) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-4 py-2 border-2 border-gray-900 text-xs font-bold uppercase transition ${
                            link.active
                                ? 'bg-gray-900 text-white shadow-md'
                                : 'bg-white text-gray-900 hover:bg-yellow-400'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={index}
                        className="px-4 py-2 border-2 border-gray-300 text-gray-400 bg-gray-50 text-xs font-bold uppercase cursor-not-allowed"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </div>
    );
}
