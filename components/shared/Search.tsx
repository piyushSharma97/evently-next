"use client"

import Image from 'next/image';
import { useEffect, useState } from 'react'
import { Input } from '../ui/input';

import { useRouter, useSearchParams } from 'next/navigation';

import React from 'react'

function Search({ placeholder = 'Search title...' }: { placeholder?: string }) {

    const [query, setQuery] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
  return (
    <div className="flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
   <Image src="/assets/icons/search.svg" alt="search" width={24} height={24} />
<Input
   type="text"
/>
        </div>
  )
}

export default Search