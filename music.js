/* 1. render song
    2. scroll top
    3. play / pause / seek
    4. CD rotate
    5. Next / prev
    6. random
    7. next / repeat when ended
    8. activiti song
    9. scroll activiti song into view
    10. play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "PLAY MUSIC";
const cd = $(".cd");

const heading = $(".info-song .body h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const nameSinger = $(".name-singer")
// sự kiện bấm nút
const playBtn = $(".btn-toggle-play");
const player = $(".player")
//tiến độ
const progress = $("#progress");

//next bài hát
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");

//random
const randomBtn = $(".btn-random");

//repeat
const repeatBtn = $(".btn-repeat");

const turn = $(".cd-img");

//khi bấm vào list music thì play
const playlist = $(".playlist");


const app = {
    currenIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [

        {
            name: "Những lời hứa bỏ quên",
            singer: "VŨ. x DEAR JANE",
            path: './asscec/music/nhungloihuaboquenshort.mp3',
            image: './asscec/img/nhungloihuaboquen.jpg'
        },

        {
            name: "Mười Năm",
            singer: "Đen Vâu",
            path: "./asscec/music/muoinam.mp3",
            image: './asscec/img/muoinamden.jpg',
        },

        {
            name: "Hương Hoa Phai Tàn",
            singer: "H2K",
            path: './asscec/music/huonghoaphaitan.mp3',
            image: './asscec/img/huonghoaphaitan.jpg'
        },
    
        {
            name: "Một triệu like",
            singer: "Đen Vâu",
            path: './asscec/music/mottrieulike.mp3',
            image: './asscec/img/1trieulike.jpg',
        },
    
        {
            name: "Chờ đợi có đáng sợ",
            singer: "Andiez x Freak D",
            path: './asscec/music/chodoicodangso.mp3',
            image: './asscec/img/chodoicodangso.jpg'
        },

        {
            name: "Cỏ gió và mây",
            singer: "Nha - Kim Nguyễn",
            path: './asscec/music/cogiovamay.mp3',
            image: './asscec/img/cogiovamay.jpg'
        },

        {
            name: "Đừng ai nhắc về cô ấy",
            singer: "Đạt G",
            path: './asscec/music/dungainhacvecoay.mp3',
            image: './asscec/img/dungainhacvecoay.jpg'
        },

        {
            name: "Đừng hỏi em ổn không",
            singer: "Cover by H2K & Po Bae",
            path: './asscec/music/dunghoiemonkhong.mp3',
            image: './asscec/img/dunghoiemonkhong.jpg'
        },

        {
            name: "Lao tâm khổ tứ",
            singer: "Thanh Hưng",
            path: './asscec/music/laotamkhotu.mp3',
            image: './asscec/img/laotamkhotu.png'
        },

        {
            name: "Những lời hứa bỏ quên",
            singer: "VŨ. x DEAR JANE",
            path: './asscec/music/nhungloihuaboquen.mp3',
            image: './asscec/img/nhungloihuaboquen.jpg'
        },

        {
            name: "Sau mình chưa nắm tay",
            singer: "YAN NGUYỄN",
            path: './asscec/music/saominhchuanamtay.mp3',
            image: './asscec/img/saominhchuanamtaynhau.jpg'
        },
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.getItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currenIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        })
        playlist.innerHTML = htmls.join("");
    },

    //định nghĩa thuộc tính
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currenIndex]
            }
        })
    },
    // tạo hàm xử lí event
    handleEvent: function() {
        const _this = this;//đây là thằng app = this
        const cdwidth = cd.offsetWidth;

        //xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate ([
                {transform: 'rotate(360deg)'}
            ],
                {
                    duration: 10000, //quay 10 giây
                    iterations: Infinity, // lặp lại vô hạn
                }
        )
        //đĩa dừng và đợi những sự kiện khác
        cdThumbAnimate.pause();

        

        //xử lí phóng to thu nhỏ cd
        let lastCall = 0;
        const throttleDelay = 100; // 100ms
        document.onscroll = function() {
            const now = Date.now();
            if (now - lastCall < throttleDelay) {
                return; // Nếu thời gian giữa các lần gọi không đủ, thì thoát
            }
            lastCall = now;
            //vuốt lên xuống thanh scroll nó có số nhất định
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdwidth = cdwidth - scrollTop;
            cd.style.width = newCdwidth > 0 ? newCdwidth + "px" : 0;
            cd.style.opacity = newCdwidth / cdwidth
        }

        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            }

            else {
                audio.play();
            }
        } 

        //khi song được play thì 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            //khi nhạc phát thì đĩa quay
            cdThumbAnimate.play();
        }

        //khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            //khi nhạc dừng thì đĩa dừng
            cdThumbAnimate.pause();
        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPercent;
        }

        progress.onchange = function(e) {
           const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        //khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong()
        }

        //khi bấm nút prev
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong()

        }

        
        //xử lý random bật tắt random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            // nếu boolane là true thì nó sẽ add còn nếu boolane là flase thì nó sẽ remove
            
            randomBtn.classList.toggle("active", _this.isRandom);
        }
        
        //xử lí next song khi audio ended
        audio.onended = function() {//khi hát hết bài hát
            if(_this.isRepeat) {//xử lí hát lại bài hát khi audio ended
                audio.play();
            }
            else {
                nextBtn.click();//có nghĩa là nó sẽ bấm vào nút next
            }
        }

        //xử lí bật tắt repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.repeatBtn);
        }

         //lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {// e là event còn taget là cái đích mà bạn click vào
            const songNode = e.target.closest('.song:not(.active')
            //và target nó sẽ trả về chính cái mà bạn click vào
            //nếu không phải thằng active hoặc là thằng option thì mới click vào được
            if (songNode || e.target.closest('.option')) {//closest nó sẽ trả về 1 element 1 là chính nó 2 là cha của nó còn nếu không thấy elment thì nó sẽ trả về null
            //xử lí khi click vào song thì chuyển tới bài đó
                
                if (songNode) {
                    _this.currenIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()  
                }

            //xử lí khi vào song option
                if (e.target.closest('.option')) {

                }

            }
        }

    },

    //khi chúng ta next bài hát tới cuối cùng thì nó sẽ chồi lên
    scrollToActiveSong: function() {
        setTimeout(() => {
        $(".song.active").scrollIntoView({
            behavior: 'smooth',//khi kéo cho nó mượt mà hơn
            block: 'nearest',
        });

        }, 300);
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        nameSinger.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        turn.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    //làm next bài hát
    nextSong: function() {
        this.currenIndex++;//tăng index của song lên
        if (this.currenIndex >= this.songs.length) {
            this.currenIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currenIndex--;
        if (this.currenIndex < 0) {
            this.currenIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex ===  this.currenIndex);
        this.currenIndex = newIndex;
        this.loadCurrentSong();
    },

   

    //bắt đầu thực hiện công việc 
    start: function() {
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        //định nghĩa ra những thuộc tính cho object
        this.defineProperties();

        //lắng nghe sự kiện
        this.handleEvent();

        //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //lấy ra listmusic
        this.render();

        //hiển thị trạng thái ban đầu của button 
        randomBtn.classList.toggle("active", _this.isRandom);
        repeatBtn.classList.toggle("active", _this.repeatBtn);
    }
}

app.start()
 
