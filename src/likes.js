import {blockButton, unblockButton} from './user/util.js';
import {sendFetchRequest, deleteData} from "./api/base/async-api.js";
import {APP_STORAGE, URL} from './const.js';
import {HttpMethod} from "./enum";

const submitBtnElement = document.querySelector('.likes-count');
const previewModalLikesElement = document.querySelector('.likes-count');

const getLike = (likes, userId, pictureId) => {
    return likes.find((like) => {
        return (like.user_id === userId) && (like.picture_id === pictureId);
    })
};

const updateLikesCount = (likes) => {
    previewModalLikesElement.textContent = likes.length;
    const picture = JSON.parse(localStorage.getItem('gallery_cGljdHVyZQ=='));
    const {user} = JSON.parse(localStorage.getItem(APP_STORAGE.ACCESS_TOKEN));

    if (getLike(picture.likes, user.id, picture.id)) {
        submitBtnElement.classList.add('likes-count--active');
    } else {
        submitBtnElement.classList.remove('likes-count--active');
    }
}

const setLike = (onSuccess, userId, pictureId) => {
    const formData = new FormData();
    formData.set('user_id', userId);
    formData.set('picture_id', pictureId);
    
    blockButton(submitBtnElement, '');
    window.setTimeout(() => {
        sendFetchRequest(URL.LIKE.POST, HttpMethod.POST, formData)
            .then(() => {
                onSuccess();
                unblockButton(submitBtnElement);
            })
            .catch(() => {
                unblockButton(submitBtnElement);
            })
    }, 500);
}

const removeLike = (onSuccess, likeId) => {
    blockButton(submitBtnElement, '');

    window.setTimeout(() => {
        deleteData(URL.LIKE.DELETE + likeId)
            .then(() => {
                onSuccess();
                unblockButton(submitBtnElement);
            })
            .catch(() => {
                unblockButton(submitBtnElement);
            })
    }, 500)
}

const setLikesCountClick = (onSuccess) => {
    submitBtnElement.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (!localStorage.getItem(APP_STORAGE.ACCESS_TOKEN)) {
            return;
        }

        const {user} = JSON.parse(localStorage.getItem(APP_STORAGE.ACCESS_TOKEN));
        const picture = JSON.parse(localStorage.getItem(APP_STORAGE.PICTURE));
        if (getLike(picture.likes, user.id, picture.id)) {
            const likeId = picture.likes.find(like => like.user_id === user.id).id;
            removeLike(
                () => {
                    onSuccess(picture.id);
                },
                likeId
            );
        } else {
            setLike(
                () => {
                    onSuccess(picture.id);
                },
                user.id,
                picture.id
            );
        }
    });

};


export {
    setLikesCountClick,
    updateLikesCount
};