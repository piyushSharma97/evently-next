

import { useRouter, useSearchParams } from 'next/navigation'


import React from 'react'
type PaginationProps = {
    page: number | string,
    totalPages: number,
    urlParamName?: string
  }
function Pagination({ page, totalPages, urlParamName }: PaginationProps) {
  return (
    <div>Pagination</div>
  )
}

export default Pagination