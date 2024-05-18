const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'LHL';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const cd = $('.cd');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const playerClass = $('.player');
const progress = $('#progress');
const btnPrev = $('.btn-prev');
const btnNext = $('.btn-next');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
const playList = $('.playlist');
const volume = $('#volume');


const app = {
  currentIndex: 0, // gắn giá trị xuất hiện bài hát đầu tiên
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: 'Giàu vì bạn sang vì vợ',
      singer: 'MCK',
      path: 'https://github.com/luuhoang-linh/music-player/blob/main/music/song1.mp3',
      image: 'https://media.viez.vn/prod/2021/8/1/192913132_508136300601994_1673026616834777129_n_8965ce57a9.jpeg'
    },
    {
      name: 'Day And Night',
      singer: '越南鼓',
      path: './music/song2.mp3',
      image: 'https://i.kfs.io/album/global/181570969,0v1/fit/500x500.jpg'
    },
    {
      name: 'TATU',
      singer: 'DJ Thái Hoàng',
      path: './music/song3.mp3',
      image: 'https://images2.thanhnien.vn/528068263637045248/2023/4/25/thai-hoang-5-1682410775291631820128.jpeg'
    },
    {
      name: 'Nếu Em Không Về',
      singer: 'Công Thành Remix',
      path: './music/song4.mp3',
      image: 'https://thanhnien.mediacdn.vn/Uploaded/diennv/2022_11_22/z3896195757234-4c19f5818b5f6d2a31f9bbf583d5628a-4485.jpg'
    },
    {
      name: 'Giàu vì bạn sang vì vợ',
      singer: 'MCK',
      path: './music/song1.mp3',
      image: 'https://media.viez.vn/prod/2021/8/1/192913132_508136300601994_1673026616834777129_n_8965ce57a9.jpeg'
    },
    {
      name: 'Day And Night',
      singer: '越南鼓',
      path: './music/song2.mp3',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYQDWUCoXJBH0H9Kv4DOaYf1zUVQ7Ca2n_RKs7e-CEzBm0mPMp'
    },
    {
      name: 'TATU',
      singer: 'DJ Thái Hoàng',
      path: './music/song3.mp3',
      image: 'https://images2.thanhnien.vn/528068263637045248/2023/4/25/thai-hoang-5-1682410775291631820128.jpeg'
    },
    {
      name: 'Nếu Em Không Về',
      singer: 'Công Thành Remix',
      path: './music/song4.mp3',
      image: 'https://thanhnien.mediacdn.vn/Uploaded/diennv/2022_11_22/z3896195757234-4c19f5818b5f6d2a31f9bbf583d5628a-4485.jpg'
    }
  ],
  // tải lên danh sách bài hát
  render: function () {
    const htmls = this.songs.map(function (song, index) {
      return `<div class="song" id="song_${index}">
      <div class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div>`
    });
    playList.innerHTML = htmls.join('');
  },

  // định nghĩa
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      }
    })
  },

  // xử lí các sự kiện
  handleEvent: function () {
    // khởi tạo _this = this = app, để phân biệt hàm handle với thằng app
    const _this = this;

    // xử lí CD quay và dừng
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ], {
      duration: 10000,
      iterations: Infinity
    });
    // dừng hiêuj ứng quay của điã CD
    cdThumbAnimate.pause();

    // xử lí thu gọn đĩa CD
    // lấy ra cdWidth gốc để tính toán và set lại giá trị của CD
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      // scroll = độ kéo 
      const scroll = window.scrollY || document.documentElement.scrollTop;
      // tính độ rộng mới
      const newCdWidth = cdWidth - scroll;
      // gắn độ rộng mới + tránh số âm
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      // độ mờ của đĩa cd
      cd.style.opacity = newCdWidth / cdWidth;
    }

    // xử lí trạng thái thẻ audio
    audio.onplay = function () {
      // bật cờ playing = true 
      _this.isPlaying = true;
      // thêm class playing 
      playerClass.classList.add('playing');
    }
    audio.onpause = function () {
      // xóa class playing 
      playerClass.classList.remove('playing');
      // bật cờ playing = false
      _this.isPlaying = false;
    }

    // xử lí nút play
    playBtn.onclick = function () {
      if (playerClass.classList.contains('playing')) {
        // dừng nhạc
        audio.pause();
        // cd thumb dừng
        cdThumbAnimate.pause();
      } else {
        // chạy nhạc
        audio.play();
        // cd thumb quay
        cdThumbAnimate.play();
      }
    }

    // khi đang phát nhạc, chạy thanh thời gian
    audio.ontimeupdate = function () {
      // tính phần trăm sau đó gắn cho thanh value với step = 1
      percent = Math.floor(audio.currentTime / audio.duration * 100);
      progress.value = percent;
    }

    // xử lí khi tua nhạc
    progress.onchange = function () {
      // khi có thay đổi ở thanh thời gian, lấy phần trăm sau khi thay đổi
      percent = progress.value;
      // tính ra thời gian thay đổi 
      currentTime = percent / 100 * audio.duration;
      // chuyển thời gian của bài hát thành thời gian thay đôir
      audio.currentTime = currentTime;
    }

    // xử lí hát bài tiếp theo 
    btnNext.onclick = function () {
      // thêm active, sau đó xóa đi tạo hiệu ứng nhấp 
      btnNext.classList.add("active");
      setTimeout(function () {
        btnNext.classList.remove("active");
      }, 100);
      // phát bài tiếp theo
      _this.nextSong();
      audio.play();
      cdThumbAnimate.play();
    }

    // xử lí bài hát trước
    btnPrev.onclick = function () {
      // thêm active, sau đó xóa đi tạo hiệu ứng nhấp 
      btnPrev.classList.add("active");
      setTimeout(function () {
        btnPrev.classList.remove("active");
      }, 100);
      // gọi hàm prev, phát nhạc, quay CD
      _this.prevSong();
      audio.play();
      cdThumbAnimate.play();
    }

    // xử lí sự kiện random
    btnRandom.onclick = function () {
      // chuyển cờ random thành true
      _this.isRandom = !_this.isRandom;
      // thêm active vào random để hiện màu
      btnRandom.classList.toggle("active", _this.isRandom);
      // xóa active của repeat nếu random được bật, prev và next không cần
      _this.isRepeat = false;
      btnRepeat.classList.remove('active');
      // config cờ random
      _this.setConfig('isRandom', _this.isRandom);
    }

    // xử lí sự kiện repeat 
    btnRepeat.onclick = function () {
      // bật cờ repeat để sự kiện next và prev sẽ phát lại một bài
      _this.isRepeat = !_this.isRepeat;
      // thêm active vào repeat
      btnRepeat.classList.toggle("active", _this.isRepeat);
      // xóa active của random
      _this.isRandom = false;
      btnRandom.classList.remove('active');
      // config cờ repeat
      _this.setConfig('isRepeat', _this.isRepeat);
    }

    // xử lí khi phát hết bài hát hiện tại
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    }

    // xử lí khi click vào từng bài hát
    const songElements = $$('.song');
    songElements.forEach(function (song, index) {
      song.onclick = function () {
        // xóa class active ở tất cả bài hát
        _this.deleteClassActive();
        // phát bài hát có index tương ứng
        _this.currentIndex = index;
        _this.loadCurrentSong();
        // thêm class active vào bài hát hiện tại
        _this.addClassActive(index);
        audio.play()
      };
    });

    // xử lí nút volume
    volume.onchange = function () {
      // lấy ra phần trăm của thanh volume
      percent = volume.value;
      // gắn vào audio
      audio.volume = percent;
    };

  },
  // lấy bài hát hiện tại
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
    // xóa class active
    this.deleteClassActive();
    // thêm active vào bài hát đang phát
    this.addClassActive(this.currentIndex);
  },
  // thêm class active vào bài hát hiện tại
  addClassActive: function (id) {
    const songId = '#song_' + id;
    const songCurrent = $(songId);
    songCurrent.classList.add('active');
  },
  // xóa class active ở tất cả các class khác
  deleteClassActive: function () {
    const songElements = $$('.song');
    songElements.forEach(function (song) {
      song.classList.remove('active');
    });
  },
  // phát bài tiếp theo
  nextSong: function () {
    // nếu random hoặc repeat thì thực hiện hàm random, repeat
    if (this.isRandom) {
      this.randomSong();
    } else if (this.isRepeat) {
      this.repeatSong();
    } else {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
    }
    this.loadCurrentSong();
  },
  // phát bài trước đó
  prevSong: function () {
    // nếu random hoặc repeat thì thực hiện hàm random, repeat
    if (this.isRandom) {
      this.randomSong();
    } else if (this.isRepeat) {
      this.repeatSong();
    } else {
      this.currentIndex--;
      if (this.currentIndex <= 0) {
        this.currentIndex = this.songs.length - 1;
      }
    }
    this.loadCurrentSong();
  },
  // random bài hát
  randomSong: function () {
    // khởi tạo gía trị currentIndex mới 
    let newCurrentIndex = 1;
    do {
      newCurrentIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === newCurrentIndex);
    // index mơi khác giá trị index cũ thì thoát vòng lặp sau đó găns giá trị mơí cho giá trị cũ
    // tránh bị lặp bài khi cờ random bật
    this.currentIndex = newCurrentIndex;
    this.loadCurrentSong();
  },
  // vòng lặp một bài hát
  repeatSong: function () {
    // phát lại bài hiện tại là xong
    this.loadCurrentSong();
  },
  // set cấu hình 
  setConfig: function (config) {
    // config tránh f5 bị mất
    if (this.config.isRandom && !this.config.isRepeat) {
      this.isRandom = this.config.isRandom;
      btnRandom.classList.add('active');
    }
    if (this.config.isRepeat && !this.config.isRandom) {
      this.isRepeat = this.config.isRepeat;
      btnRepeat.classList.add('active');
    }
  },
  // chạy tất cả các hàm
  start: function () {
    this.defineProperties();
    this.render();
    this.handleEvent();
    this.loadCurrentSong();
    this.setConfig();
  }
}

app.start();