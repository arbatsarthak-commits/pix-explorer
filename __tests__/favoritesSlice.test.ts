import favoritesReducer, {
  addFavorite,
  clearFavorites,
  removeFavorite,
} from '../src/redux/slices/favoritesSlice';

describe('favoritesSlice', () => {
  const image = {id: '42', author: 'Test', url: 'https://example.com/42.jpg'};

  it('adds and removes favorites', () => {
    let state = favoritesReducer(undefined, {type: '@@INIT'});
    state = favoritesReducer(state, addFavorite(image));
    expect(state.favoriteImageIds).toContain('42');
    expect(state.favoriteMetadata['42']).toEqual(image);

    state = favoritesReducer(state, removeFavorite('42'));
    expect(state.favoriteImageIds).not.toContain('42');
    expect(state.favoriteMetadata['42']).toBeUndefined();
  });

  it('does not duplicate favorite ids', () => {
    let state = favoritesReducer(undefined, addFavorite(image));
    state = favoritesReducer(state, addFavorite(image));
    expect(state.favoriteImageIds).toEqual(['42']);
  });

  it('clears all favorites', () => {
    let state = favoritesReducer(undefined, addFavorite(image));
    state = favoritesReducer(state, clearFavorites());
    expect(state.favoriteImageIds).toHaveLength(0);
  });
});
