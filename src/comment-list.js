import {URL} from './const.js';
import {clearEntityList} from "./util";
import {blockButton, unblockButton} from './user/util.js';

const totalCommentCountElement = document.querySelector('.comments-count');
const renderedCommentCountElement = document.querySelector('.comments-count--rendered');
const showMoreButtonElement = document.querySelector('.social__comments-loader');
const commentListElement = document.querySelector('.social__comments');
const commentTemlate = document.getElementById('comment')
    .content
    .querySelector('.social__comment');

const COMMENT_COUNT_PER_STEP = 5;

const setLoaderClick = function (comments) {
    if (this.onLoaderClick !== undefined) {
        showMoreButtonElement.removeEventListener('click', this.onLoaderClick);
    }

    this.onLoaderClick = () => {
        blockButton(showMoreButtonElement, 'loading');
        window.setTimeout(()=>{
            unblockButton(showMoreButtonElement);
            renderComments(comments, renderedCommentCount, renderedCommentCount + COMMENT_COUNT_PER_STEP);
            renderedCommentCount += COMMENT_COUNT_PER_STEP;

            if (renderedCommentCount >= comments.length) {
                showMoreButtonElement.classList.add('hidden');
            }
        }, 1000);

    };

    let renderedCommentCount = 5;
    showMoreButtonElement.addEventListener('click', this.onLoaderClick);
}

const renderComments = (comments, from, to) => {
    for (const {message, user} of comments.slice(from, to)) {
        const commentElement = commentTemlate.cloneNode(true);
        commentElement.querySelector('.social__text').textContent = message;
        commentElement.querySelector('.social__picture').src = URL.UPLOAD.AVATAR + user.avatar;
        commentListElement.append(commentElement);
        renderedCommentCountElement.textContent = String((+renderedCommentCountElement.textContent) + 1);
    }
};

const renderCommentList = (comments) => {
    clearEntityList('.social__comment');

    const to = Math.min(comments.length, COMMENT_COUNT_PER_STEP);

    renderComments(comments, 0, to);
    totalCommentCountElement.textContent = String(comments.length);
    renderedCommentCountElement.textContent = String(to);

    if (comments.length > COMMENT_COUNT_PER_STEP) {
        showMoreButtonElement.classList.remove('hidden');
    } else {
        showMoreButtonElement.classList.add('hidden');
    }

    setLoaderClick.call(renderCommentList, comments);
};

export {renderCommentList};
