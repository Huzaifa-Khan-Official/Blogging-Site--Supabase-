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
        try {
            await incrementBlogVisits(slug);
        } catch (error) {
            console.error('Error tracking visit:', error)
        }
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