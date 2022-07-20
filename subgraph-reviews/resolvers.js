const resolvers = {
  Query: {
    latestReviews: (_, __, {dataSources}) => {
      return dataSources.reviewsAPI.getLatestReviews();
    }
  },
  Location: {
    // Since the review subgraph provides fields for the Location entity
    // it will resolve a reference for the Location entity. Since a location
    // entity will be returned by the Location subgraph before adding any
    // additional fields from the reviews subgraph, it will be provided
    // thanks to the execution plan. Nothing needs to be done in this case
    // other than pass the referenced location through the reference resolver
    // so the resolver functions for the additonal provided fields for the 
    // location entity has a parent object to destructure. This isn't even 
    // necessary as Apollo server provides a default reference resolver when
    // one is not provided. The below code is just a representation of that 
    // default reference resolver for the Location entity.
    // __resolveReference: (location) => {
    //   return location
    // },
    overallRating: ({ id }, _, { dataSources }) => {
      return dataSources.reviewsAPI.getOverallRatingForLocation(id);
    },
    reviewsForLocation: ({ id }, _, { dataSources }) => {
      return dataSources.reviewsAPI.getReviewsForLocation(id);
    }
  },
  Mutation: {
    submitReview: (_, {locationReview}, {dataSources}) => {
      const newReview = dataSources.reviewsAPI.submitReviewForLocation(locationReview);
      return {code: 200, success: true, message: 'success', locationReview: newReview};
    }
  },
  Review: {
    location: ({ locationId }) => {
      return { id: locationId }
    }
  }
};

module.exports = resolvers;
