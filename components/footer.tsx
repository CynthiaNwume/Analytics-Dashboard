export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Global Sales Analytics. All rights reserved.
          </p>
          <p className="text-sm font-medium text-foreground">
            Developed by <span className="text-primary">Ekene Cynthia Nwume</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
