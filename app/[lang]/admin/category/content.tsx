"use client";
import { useState, useEffect } from 'react';

export default function Content({ lang }: { lang: string }) {

  useEffect(() => {
    console.log( lang );
  });

  return (
    <h2>カテゴリー</h2>
  )
}