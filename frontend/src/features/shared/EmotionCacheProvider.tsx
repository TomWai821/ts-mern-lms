"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { ReactNode, useState } from "react";

interface InsertedStyle
{
    name: string;
    isGlobal: boolean;
}

const EmotionCacheProvider = ({ children }: { children: ReactNode }) =>
{
    const [registry] = useState(() =>
    {
        const cache = createCache({ key: "mui" });
        cache.compat = true;

        const previousInsert = cache.insert;
        let inserted: InsertedStyle[] = [];

        cache.insert = (...args) =>
        {
            const [selector, serialized] = args;

            if (cache.inserted[serialized.name] === undefined)
            {
                inserted.push({ name: serialized.name, isGlobal: !selector });
            }

            return previousInsert(...args);
        };

        const flush = () =>
        {
            const pendingStyles = inserted;
            inserted = [];
            return pendingStyles;
        };

        return { cache, flush };
    });

    useServerInsertedHTML(() =>
    {
        const inserted = registry.flush();

        if (inserted.length === 0)
        {
            return null;
        }

        let styles = "";
        let dataEmotionAttribute = registry.cache.key;
        const globalStyles: { name: string; style: string }[] = [];

        inserted.forEach(({ name, isGlobal }) =>
        {
            const style = registry.cache.inserted[name];

            if (typeof style !== "string")
            {
                return;
            }

            if (isGlobal)
            {
                globalStyles.push({ name, style });
            }
            else
            {
                styles += style;
                dataEmotionAttribute += ` ${name}`;
            }
        });

        return (
            <>
                {globalStyles.map(({ name, style }) => (
                    <style
                        key={name}
                        data-emotion={`${registry.cache.key}-global ${name}`}
                        dangerouslySetInnerHTML={{ __html: style }}
                    />
                ))}
                {styles && (
                    <style
                        data-emotion={dataEmotionAttribute}
                        dangerouslySetInnerHTML={{ __html: styles }}
                    />
                )}
            </>
        );
    });

    return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
};

export default EmotionCacheProvider;
