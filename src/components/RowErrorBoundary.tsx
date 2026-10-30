"use client";

import { Component, type ReactNode } from "react";

export default class RowErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[RowErrorBoundary]", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="px-2.5 py-2 text-xs text-muted italic">
          Gagal menampilkan item ini. Coba muat ulang halaman.
        </div>
      );
    }
    return this.props.children;
  }
}
