import type { LoaderArgs } from '@remix-run/node';
import type { SatoriOptions } from 'satori/wasm';
import satori from 'satori';
import svg2img from 'svg2img';
import invariant from 'tiny-invariant';

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const title = url.searchParams.get("title")
  invariant(title, "Title is required")

  const description = url.searchParams.get("description")
  invariant(description, "Description is required")

  const jsx = (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        backgroundImage: "url('https://res.cloudinary.com/shafspecs/image/upload/v1694911293/RemixPWA_Social_Image_1_huzpiy.png')",
        backgroundSize: '1200px 630px',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: 88,
          left: 72
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: title.length < 40 ? 56 : 48,
            fontStyle: 'normal',
            fontWeight: 700,
            color: 'white',
            fontFamily: 'Inter',
            marginTop: 30,
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
          }}
        >
          <b>{title}</b>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: description.length < 80 ? 36 : 30,
            fontStyle: 'normal',
            color: 'white',
            lineHeight: 1.8,
            fontFamily: 'Ubuntu',
            maxWidth: '720px',
            whiteSpace: 'pre-wrap',
          }}
        >
          <b>{description}</b>
        </div>
      </div>
    </div>
  );

  async function getFont(
    font: string,
    weights = [400, 500, 600, 700],
    text = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\!@#$%^&*()_+-=<>?[]{}|;:,.`'’\"–—",
  ) {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${font}:wght@${weights.join(
        ";",
      )}&text=${encodeURIComponent(text)}`,
      {
        headers: {
          // Make sure it returns TTF.
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
      },
    ).then((response) => response.text())
    const resource = css.matchAll(
      /src: url\((.+)\) format\('(opentype|truetype)'\)/g,
    )
    return Promise.all(
      [...resource]
        .map((match) => match[1])
        .map((url) =>
          fetch(url).then((response) =>
            response.arrayBuffer(),
          ),
        )
        .map(async (buffer, i) => ({
          name: font,
          style: "normal",
          weight: weights[i],
          data: await buffer,
        })),
    ) as Promise<SatoriOptions["fonts"]>
  }

  const svg = await satori(jsx, {
    width: 1200,
    height: 630,
    fonts: await Promise.all([getFont("Inter"), getFont("Ubuntu")]).then((fonts) => fonts.flat()),
  });

  const { data, error } = await new Promise(
    (
      resolve: (value: {
        data: Buffer | null
        error: Error | null
      }) => void,
    ) => {
      svg2img(svg, (error, buffer) => {
        if (error) {
          resolve({ data: null, error })
        } else {
          resolve({ data: buffer, error: null })
        }
      })
    },
  );

  if (error) {
    console.error(error)
    return new Response(error.toString(), {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }

  return new Response(data, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}