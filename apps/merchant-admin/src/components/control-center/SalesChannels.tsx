import React from "react";
import { SalesChannel } from "@vayva/shared";
import { Icon, cn } from "@vayva/ui";
import { Switch } from "@/components/ui/Switch";

interface SalesChannelsProps {
  channels: SalesChannel[];
}

export const SalesChannels = ({ channels }: SalesChannelsProps) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Sales Channels</h2>
          <p className="text-sm text-gray-500">
            Where customers can place orders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="group bg-white rounded-[32px] border border-gray-100 p-6 flex items-center justify-between hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-500"
          >
            <div className="flex items-center gap-6">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500",
                  channel.type === "whatsapp"
                    ? "bg-[#25D366]/10 text-[#25D366]"
                    : "bg-blue-50 text-blue-600",
                )}
              >
                <Icon
                  name={channel.type === "whatsapp" ? "MessageCircle" : "Globe"}
                  size={28}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-gray-900 tracking-tight">{channel.name}</h4>
                  {channel.status === "enabled" && (
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  )}
                </div>
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black flex items-center gap-1.5 transition-colors"
                >
                  {channel.url ? channel.url.replace(/^https?:\/\//, '') : ''} <Icon name="ExternalLink" size={10} />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 pl-4 border-l border-gray-50">
              <div className="flex flex-col items-end gap-1.5">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  channel.status === "enabled" ? "text-green-600" : "text-gray-300"
                )}>
                  {channel.status}
                </span>
                <Switch
                  checked={channel.status === "enabled"}
                  onCheckedChange={() => { }} // Implementation would go here
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
