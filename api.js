// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const postApi = createApi({
  tagTypes: ["Posts"],
  reducerPath: "posts",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://warm-springs-37057.herokuapp.com/test/api",
  }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => `/posts`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Posts", _id })),
              { type: "Posts", _id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Posts", _id: "LIST" }],
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: `/posts`,
        method: "POST",
        body: data,
      }),
      transformResponse: ({ data }) => data,
      invalidatesTags: [{ type: "Posts", _id: "LIST" }],
    }),
    deletePost: builder.mutation({
      query: ({ _id }) => ({
        url: `/posts/delete/${_id}`,
        method: "DELETE",
      }),
      transformResponse: ({ data }) => {
        return data;
      },
      invalidatesTags: (result, error, { _id }) => [{ type: "Posts", _id }],
    }),
    updatePost: builder.mutation({
      // note: an optional `queryFn` may be used in place of `query`
      query: ({ _id, ...data }) => ({
        url: `/posts/${_id}`,
        method: "PUT",
        body: data,
      }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: ({ data }) => data,
      invalidatesTags: (result, error, { _id }) => [{ type: "Posts", _id }],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
} = postApi;
