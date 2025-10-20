'use client'
import { incrementBlogVisits } from '@/actions/write/actions'
import Link from 'next/link'

interface BlogLinkProps {
    slug: string
    children: React.ReactNode
    className?: string
}

export default function BlogLink({ slug, children, className }: BlogLinkProps) {
    const handleClick = async () => {
        await incrementBlogVisits(slug);
    }

    return (
        <Link
            href={`/blog/${slug}`}
            onClick={handleClick}
            className={className}
        >
            {children}
        </Link>
    )
}