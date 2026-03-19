import { DatabankItem, Section } from "@/hooks/use-swapi";

interface DatabankListProps {
  items: DatabankItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function DatabankList({
  items,
  selectedId,
  onSelect,
}: DatabankListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            background:
              selectedId === item.id
                ? "rgba(0,212,255,0.12)"
                : "rgba(0,8,18,0.6)",
            border: `1px solid ${
              selectedId === item.id
                ? "rgba(0,212,255,0.5)"
                : "rgba(0,212,255,0.12)"
            }`,
            borderRadius: 4,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (selectedId !== item.id) {
              e.currentTarget.style.background = "rgba(0,212,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedId !== item.id) {
              e.currentTarget.style.background = "rgba(0,8,18,0.6)";
              e.currentTarget.style.borderColor = "rgba(0,212,255,0.12)";
            }
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 4,
              overflow: "hidden",
              flexShrink: 0,
              background: "rgba(0,4,12,0.8)",
              border: "1px solid rgba(0,212,255,0.2)",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontFamily: "'Share Tech Mono', monospace",
                color: selectedId === item.id ? "#fff" : "rgba(0,212,255,0.9)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
                textShadow:
                  selectedId === item.id
                    ? "0 0 8px rgba(0,212,255,0.5)"
                    : "none",
              }}
            >
              {item.name}
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "'Share Tech Mono', monospace",
                color: "rgba(0,212,255,0.5)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.description?.slice(0, 80)}...
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface DatabankDetailPanelProps {
  item: DatabankItem & { planetId?: string };
  onClose: () => void;
  onLinkClick?: (section: Section, id: string) => void;
}

export function DatabankDetailPanel({
  item,
  onClose,
  onLinkClick,
}: DatabankDetailPanelProps) {
  return (
    <div className="w-full h-full flex flex-col relative z-20">
      <div className="p-4 border-b border-primary/30 bg-card/90 flex justify-between items-center backdrop-blur-md">
        <h2 className="text-xl font-bold glow-text tracking-widest uppercase">
          DATABASE ENTRY
        </h2>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "1px solid transparent",
            padding: 4,
            cursor: "pointer",
            color: "rgba(0,212,255,0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(0,212,255,0.5)";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div
          style={{
            height: 200,
            overflow: "hidden",
            background: "rgba(0,4,12,0.8)",
            borderBottom: "1px solid rgba(0,212,255,0.2)",
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="p-4">
          {item.planetId && (
            <button
              onClick={() =>
                onLinkClick && onLinkClick("planets", item.planetId!)
              }
              style={{
                fontSize: 10,
                color: "#00d4ff",
                padding: "3px 8px",
                border: "1px solid rgba(0,212,255,0.3)",
                background: "rgba(0,212,255,0.08)",
                fontFamily: "'Share Tech Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,212,255,0.2)";
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,212,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)";
              }}
            >
              VIEW ON MAP
            </button>
          )}

          <div className="text-xs text-primary/50 mb-1">RECORD.ID</div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#fff",
              textShadow: "0 0 10px rgba(0,212,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 16,
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            {item.name}
          </h1>

          <div
            style={{
              fontSize: 11,
              fontFamily: "'Share Tech Mono', monospace",
              color: "rgba(0,212,255,0.8)",
              lineHeight: 1.6,
              padding: "12px",
              background: "rgba(0,8,18,0.6)",
              border: "1px solid rgba(0,212,255,0.15)",
              borderRadius: 4,
            }}
          >
            {item.description}
          </div>
        </div>
      </div>

      <div
        style={{
          height: 28,
          borderTop: "1px solid rgba(0,212,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          fontSize: 10,
          color: "rgba(0,212,255,0.45)",
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#00d4ff",
            }}
          />
          TERMINAL ONLINE
        </span>
        <span>SYS.V 1.0.4</span>
      </div>
    </div>
  );
}
