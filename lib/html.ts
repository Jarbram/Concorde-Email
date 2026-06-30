import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function toEmailHTML(element: React.ReactElement): string {
  const body = renderToStaticMarkup(element);
  return '<!DOCTYPE html>\n' + body;
}
