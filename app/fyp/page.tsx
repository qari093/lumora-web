import Link from "next/link";
import styles from "./styles.module.css";
import { fypYoutubeVideos, getFypYoutubeFeedSummary } from "@/src/core/fyp/youtubeFeed";

export default function FypPage() {
  const summary = getFypYoutubeFeedSummary();

  return (
    <main className={styles.shell}>
      <div className={styles.appFrame}>
        <header className={styles.topBar}>
          <div className={styles.titleRow}>
            <Link href="/" className={styles.backButton} aria-label="Back">‹</Link>
            <div className={styles.brandBlock}>
              <h1 className={styles.brand}>Lumora FYP</h1>
              <p className={styles.sub}>{summary.itemCount} safe multi-source video cards · founder review</p>
            </div>
            <button className={styles.followButton}>Follow</button>
            <button className={styles.moreButton} aria-label="More">•••</button>
          </div>

          <nav className={styles.tabs} aria-label="FYP sections">
            <span className={styles.tabActive}>Posts</span>
            <span>Replies</span>
            <span>Videos</span>
            <span>Photos</span>
          </nav>
        </header>

        <section className={styles.feed} aria-label="Multi-source retention FYP feed">
          {fypYoutubeVideos.map((video) => (
            <article key={video.id} className={styles.card}>
              <div className={styles.authorRow}>
                <img className={styles.avatar} src={video.avatarUrl} alt={`${video.channelTitle} avatar`} />
                <div className={styles.meta}>
                  <div className={styles.nameLine}>
                    <span className={styles.name}>{video.channelTitle}</span>
                    <span className={styles.handle}>{video.channelHandle} · {video.publishedAt}</span>
                  </div>

                  <p className={styles.caption}>{video.title}</p>

                  <a
                    className={styles.thumbWrap}
                    href={video.youtubeWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${video.title} on YouTube`}
                  >
                    <img className={styles.thumb} src={video.thumbnailUrl} alt={video.title} />
                    <span className={styles.play}>
                      <span className={styles.playIcon}>▶️</span>
                    </span>
                    <span className={styles.duration}>{video.duration}</span>
                  </a>

                  <div className={styles.youtube}>
                    <span className={styles.youtubeBadge}>▶️</span>
                    <span>{video.sourceLabel}</span>
                  </div>

                  <div className={styles.actions} aria-label="Video actions">
                    <span className={styles.action}>💬 {video.comments}</span>
                    <span className={styles.action}>↻ {video.reposts}</span>
                    <span className={styles.action}>♡ {video.likes}</span>
                    <span className={styles.action}>▯</span>
                    <span className={styles.action}>⇧</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <p className={styles.safeNote}>
          Sources are public-domain, CC-filtered, owned/licensed, authorized, or embed-only. Lumora does not download, rehost, or claim third-party videos.
        </p>

        <button className={styles.fab} aria-label="Create">+</button>

        <nav className={styles.bottomNav} aria-label="Main portal navigation">
          <Link href="/" className={styles.navItem}><span className={styles.navIcon}>⌂</span><span>Home</span></Link>
          <Link href="/fyp" className={styles.navItem}><span className={styles.navIcon}>⌕</span><span>FYP</span></Link>
          <Link href="/gmar" className={styles.navItem}><span className={styles.navIcon}>◈</span><span>GMAR</span></Link>
          <Link href="/live" className={styles.navItem}><span className={styles.navIcon}>🔔</span><span>Live</span></Link>
          <Link href="/profile" className={styles.navItem}><span className={styles.navIcon}>◯</span><span>Profile</span></Link>
        </nav>
      </div>
    </main>
  );
}
