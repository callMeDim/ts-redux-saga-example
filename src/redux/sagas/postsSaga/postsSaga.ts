import axios, { AxiosResponse } from "axios";
import { all, AllEffect, call, CallEffect, ForkEffect, put, PutEffect, takeLatest } from "redux-saga/effects";
import { IPost } from "../../../../models/IPost";
import {
  fetchPostsFailure,
  fetchPostsSuccess
} from "../../actions/postsActions/postsActions";
import { postTypes } from "../../ActionTypes/postsTypes";
import { PostsActions } from "../../types/types";

const getPosts = () =>
  axios.get<IPost[]>("https://jsonplaceholder.typicode.com/todos");

function* fetchPostsSaga(): Generator<
  CallEffect<AxiosResponse<IPost[], any>> | PutEffect<PostsActions>,
  void,
  AxiosResponse
> {
  try {
    const response = yield call(getPosts);
    yield put(
      fetchPostsSuccess({
        posts: response.data
      })
    );
  } catch (e: any) {
    yield put(
      fetchPostsFailure({
        error: e.message
      })
    );
  }
}

function* postsSaga(): Generator<
  AllEffect<ForkEffect<never>>
> {
  yield all([
    takeLatest(postTypes.FETCH_POST_REQUEST, fetchPostsSaga)
  ]);
}

export default postsSaga;
