const Movie = require("../modeles/movie"); // импорт моделе с соответствующей схемой
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

const {
  OK,
  CREATED,
  ERROR_400,
  ERROR_403,
  ERROR_404,
} = require("../constants");

// сработает при GET-запросе на URL '/movies' - возвращает все фильмы, сохраненные пользователем
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    /*.populate(['owner', 'likes'])*/
    .populate(["owner"])
    .then((movies) => res.status(OK).send(movies))
    .catch((err) => next(err));
};

// сработает при POST-запросе на URL '/movies' - добавляет фильм
module.exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body; // получим из объекта запроса имя и ссылку
  console.log("req.body", req.body);
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) =>
      res.status(CREATED).send({
        _id: movie._id,
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        thumbnail: movie.thumbnail,
        owner: movie.owner,
        /*movield: movie.movield,*/
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
      })
    )
    .catch((err) => {
      console.log("err.name", err.name, err);

      if (err.name === "ValidationError") {
        next(new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
    });
};

// сработает при DELETE-запросе на URL '/movies/:_id' - удаляет карточку по идентификатору
module.exports.deleteMovies = (req, res, next) => {
  console.log('req.params._id',req.params)
  Movie.findByIdAndRemove(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(ERROR_404);
      }
      // запрещаем пользователю удалять чужие карточки
      if (!movie.owner._id.equals(req.user._id)) {
        throw new ForbiddenError(ERROR_403);
      }
      res.send({
        _id: movie._id,
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailerLink: movie.trailerLink,
        thumbnail: movie.thumbnail,
        owner: movie.owner,
        /*movield: movie.movield,*/
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError(ERROR_400));
      } else {
        next(err);
      }
    });
};
