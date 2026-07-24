import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  public studentRegistrationForm: FormGroup;
  private readonly YOUTUBE_API_KEY = "AIzaSyAxReW8_F2fHojLo8NG27H-NTtdkqDNV-E";
  private readonly CHANNEL_ID = "UCScQHcVgSVNAaUEMjCk3nXw";
  private readonly MAX_RESULTS = 12;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('RegistrationComponent AfterViewInit - fetching YouTube videos');
    this.fetchYouTubeVideos();
  }

  private async fetchYouTubeVideos() {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) {
      console.error('video-grid element not found');
      return;
    }

    console.log('Starting YouTube fetch...', { YOUTUBE_API_KEY: this.YOUTUBE_API_KEY, CHANNEL_ID: this.CHANNEL_ID });

    try {
      // Step 1: Get Uploads Playlist ID from Channel
      const channelUrl = `https://www.googleapis.com/youtube/v3/channels?key=${this.YOUTUBE_API_KEY}&id=${this.CHANNEL_ID}&part=contentDetails`;
      console.log('Fetching channel URL:', channelUrl);
      const channelRes = await fetch(channelUrl);
      console.log('Channel response status:', channelRes.status);
      
      if (!channelRes.ok) {
        const errData = await channelRes.json();
        throw new Error((errData.error && errData.error.message) || `HTTP ${channelRes.status}`);
      }

      const channelData = await channelRes.json();

      if (!channelData.items || channelData.items.length === 0) {
        throw new Error("Channel not found. Check Channel ID.");
      }

      const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

      // Step 2: Fetch videos from Uploads Playlist
      const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${this.YOUTUBE_API_KEY}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=${this.MAX_RESULTS}`;
      console.log('Fetching playlist URL:', playlistUrl);
      const playlistRes = await fetch(playlistUrl);

      if (!playlistRes.ok) {
        const errData = await playlistRes.json();
        throw new Error((errData.error && errData.error.message) || `HTTP ${playlistRes.status}`);
      }

      const playlistData = await playlistRes.json();
      console.log('Playlist data received:', playlistData);
      videoGrid.innerHTML = '';

      if (!playlistData.items || playlistData.items.length === 0) {
        videoGrid.innerHTML = `
            <div class="col-12">
                <div class="bg-white p-5 text-center rounded shadow-sm">
                    <i class="fa-solid fa-video-slash fa-3x text-muted mb-3"></i>
                    <h5>No Public Videos Found</h5>
                    <p class="text-muted mb-0">Make sure your videos are set to <strong>Public</strong> (not Unlisted or Private) on YouTube.</p>
                </div>
            </div>`;
        return;
      }

      playlistData.items.forEach(item => {
        const snippet = item.snippet;
        const videoId = snippet.resourceId.videoId;
        const title = snippet.title;
        const thumbnailUrl = (snippet.thumbnails.high && snippet.thumbnails.high.url) 
          || (snippet.thumbnails.medium && snippet.thumbnails.medium.url) 
          || (snippet.thumbnails.default && snippet.thumbnails.default.url);
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const publishDate = new Date(snippet.publishedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const cardHtml = `
            <div class="col-lg-4 col-md-6">
                <div class="card video-card shadow-sm border-0 overflow-hidden">
                    <a href="${videoUrl}" target="_blank" rel="noopener noreferrer" class="thumbnail-container d-block">
                        <img src="${thumbnailUrl}" class="video-thumbnail" alt="${title}">
                        <div class="play-icon-overlay">
                            <i class="fa-solid fa-circle-play text-danger fa-3x bg-white rounded-circle"></i>
                        </div>
                    </a>
                    <div class="card-body bg-white d-flex flex-column justify-content-between p-3">
                        <h6 class="card-title fw-bold text-dark video-title mb-3">
                            <a href="${videoUrl}" target="_blank" rel="noopener noreferrer" class="text-dark text-decoration-none">
                                ${title}
                            </a>
                        </h6>
                        <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                            <span class="small text-muted">
                                <i class="fa-regular fa-calendar-alt me-1"></i> ${publishDate}
                            </span>
                            <a href="${videoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-primary btn-sm px-3 rounded-pill fw-semibold">
                                Watch <i class="fa-solid fa-arrow-up-right-from-square ms-1" style="font-size: 0.75rem;"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        videoGrid.innerHTML += cardHtml;
      });

    } catch (error) {
      console.error('YouTube API Error:', error);
      console.error('Error stack:', (error as Error).stack);
      videoGrid.innerHTML = `
          <div class="col-12">
              <div class="alert alert-danger text-center p-4 shadow-sm" role="alert">
                  <i class="fa-solid fa-triangle-exclamation fa-2x mb-2"></i>
                  <h6 class="fw-bold">YouTube API Error</h6>
                  <p class="mb-2 small"><strong>Details:</strong> ${(error as Error).message}</p>
                  <hr>
                  <p class="mb-0 small text-muted"><strong>Check browser console (F12) for full error details.</strong><br>If this mentions key restrictions or HTTP referrer, update Website Restrictions in Google Cloud Console to include:<br><code>http://localhost:4200/*</code> and <code>https://emprorswebapp20210512120616.azurewebsites.net/*</code></p>
              </div>
          </div>`;
    }
  }
}
