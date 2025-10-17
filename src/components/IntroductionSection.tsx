import Link from 'next/link'
import React from 'react'

const IntroductionSection = () => {
    return (
        <div className="flex items-center justify-between">
            {/* titles */}
            <div>
                <h1 className='text-2xl text-gray-800 md:text-5xl lg:text-6xl font-bold'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, at.</h1>
                <p className='mt-8 text-base md:text-xl'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit esse minus molestiae repellat, tempora dignissimos laborum voluptate beatae sequi nobis itaque eum minima mollitia totam ipsam ab accusamus, neque in!</p>
            </div>

            {/* animated button */}
            <Link
                href="/write"
                className='hidden md:block relative cursor-pointer'
            >
                <svg
                    viewBox="0 0 200 200"
                    width="200"
                    height="200"
                    className="text-lg tracking-widest animate-spin animatedButton cursor-pointer"
                >
                    <path
                        id="circlePath"
                        fill="none"
                        d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                    />
                    <text>
                        <textPath href="#circlePath" startOffset="0%">
                            Write your story •
                        </textPath>
                        <textPath href="#circlePath" startOffset="50%">
                            Share your idea •
                        </textPath>
                    </text>
                </svg>

                <button className="absolute top-0 left-0 right-0 bottom-0 m-auto size-20 bg-blue-800 rounded-full flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="50"
                        height="50"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    >
                        <line x1="6" y1="18" x2="18" y2="6" />
                        <polyline points="9 6 18 6 18 15" />
                    </svg>
                </button>
            </Link>
        </div>
    )
}

export default IntroductionSection