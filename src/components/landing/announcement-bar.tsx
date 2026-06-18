interface AnnouncementBarProps {
  text: string;
}

export function AnnouncementBar({ text }: AnnouncementBarProps) {
  return (
    <div className="bg-ink text-cream">
      <div className="container-tight">
        <p className="py-2.5 text-center text-xs sm:text-sm font-medium tracking-wide">
          <span className="mr-1">🔥</span>
          {text}
        </p>
      </div>
    </div>
  );
}
