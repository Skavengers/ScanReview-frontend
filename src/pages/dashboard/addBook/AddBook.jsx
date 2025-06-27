
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddBook = () => {
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      alternate_titles: [''],
      authors: [''],
      genres: [''],
      main_characters: [{ name: '', picture_url: '', role: '' }],
      meta: { publication_period: '', status: '' }
    }
  });
  const options_genres = [
    { value: '', label: 'Choose A Category' },
    { value: 'Artbook', label: 'Artbook' },
    { value: 'Western', label: 'Western' },
    { value: 'Shoujo(G)', label: 'Shoujo(G)' },
    { value: 'Silver & Golden', label: 'Silver & Golden' },
    { value: 'Gore', label: 'Gore' },
    { value: 'Action', label: 'Action' },
    { value: 'Cars', label: 'Cars' },
    { value: 'Dementia', label: 'Dementia' },
    { value: 'Genderwso', label: 'Genderwso' },
    { value: 'Kids', label: 'Kids' },
    { value: 'Military', label: 'Military' },
    { value: 'Parody', label: 'Parody' },
    { value: 'School Life', label: 'School Life' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Traditional Games', label: 'Traditional Games' },
    { value: 'Zombies', label: 'Zombies' },
    { value: 'Cartoon', label: 'Cartoon' },
    { value: 'Oneshot', label: 'Oneshot' },
    { value: 'Shounen(B)', label: 'Shounen(B)' },
    { value: 'Non-human', label: 'Non-human' },
    { value: 'Bloody', label: 'Bloody' },
    { value: 'Adaptation', label: 'Adaptation' },
    { value: 'Comedy', label: 'Comedy' },
    { value: 'Demons', label: 'Demons' },
    { value: 'Ghosts', label: 'Ghosts' },
    { value: 'Loli', label: 'Loli' },
    { value: 'Monster Girls', label: 'Monster Girls' },
    { value: 'Philosophical', label: 'Philosophical' },
    { value: 'Sci-Fi', label: 'Sci-Fi' },
    { value: 'Step Family', label: 'Step Family' },
    { value: 'Tragedy', label: 'Tragedy' },
    { value: 'Comic', label: 'Comic' },
    { value: '4-Koma', label: '4-Koma' },
    { value: 'Josei(W)', label: 'Josei(W)' },
    { value: 'Doujinshi', label: 'Doujinshi' },
    { value: 'Seinen(M)', label: 'Seinen(M)' },
    { value: 'Yuri(GL)', label: 'Yuri(GL)' },
    { value: 'Yaoi(BL)', label: 'Yaoi(BL)' },
    { value: 'Futa(J)', label: 'Futa(J)' },
    { value: 'Bara(ML)', label: 'Bara(ML)' },
    { value: 'Kodomo(Kid)', label: 'Kodomo(Kid)' },
    { value: 'Webtoon', label: 'Webtoon' },
    { value: 'Manhua', label: 'Manhua' },
    { value: 'Manhwa', label: 'Manhwa' },
    { value: 'Violence', label: 'Violence' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Cooking', label: 'Cooking' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Ecchi', label: 'Ecchi' },
    { value: 'Gayru', label: 'Gayru' },
    { value: 'Harem', label: 'Harem' },
    { value: 'Magic', label: 'Magic' },
    { value: 'Monsters', label: 'Monsters' },
    { value: 'Police', label: 'Police' },
    { value: 'Shoujo ai', label: 'Shoujo ai' },
    { value: 'Super Power', label: 'Super Power' },
    { value: 'Superhero', label: 'Superhero' },
    { value: 'Vampires', label: 'Vampires' },
    { value: 'Imageset', label: 'Imageset' },
    { value: 'Manga', label: 'Manga' },
    { value: 'Aliens', label: 'Aliens' },
    { value: 'Animals', label: 'Animals' },
    { value: 'Crossdressing', label: 'Crossdressing' },
    { value: 'Fan-Colored', label: 'Fan-Colored' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Magical Girls', label: 'Magical Girls' },
    { value: 'Music', label: 'Music' },
    { value: 'Post-Apocalyptic', label: 'Post-Apocalyptic' },
    { value: 'Shoujo', label: 'Shoujo' },
    { value: 'Shounen ai', label: 'Shounen ai' },
    { value: 'Supernatural', label: 'Supernatural' },
    { value: 'Video Games', label: 'Video Games' },
    { value: 'Adult', label: 'Adult' },
    { value: 'Mature', label: 'Mature' },
    { value: 'Smuth', label: 'Smuth' },
    { value: 'Anthology', label: 'Anthology' },
    { value: 'Blackmail', label: 'Blackmail' },
    { value: 'DegenerateMC', label: 'DegenerateMC' },
    { value: 'Delinquents', label: 'Delinquents' },
    { value: 'Gender Bender', label: 'Gender Bender' },
    { value: 'Incest', label: 'Incest' },
    { value: 'Medical', label: 'Medical' },
    { value: 'Office Workers', label: 'Office Workers' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Samurai', label: 'Samurai' },
    { value: 'Slice of Life', label: 'Slice of Life' },
    { value: 'Teacher/Student', label: 'Teacher/Student' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'Time Travel', label: 'Time Travel' },
    { value: 'Brocon/Siscon', label: 'Brocon/Siscon' },
    { value: 'Omegverse', label: 'Omegverse' },
    { value: 'Xianxia', label: 'Xianxia' },
    { value: 'Xuanhuan', label: 'Xuanhuan' },
  ];
  const [imageFile, setImageFile] = useState(null);

  const { fields: altTitles, append: addAltTitle, remove: removeAltTitle } = useFieldArray({ control, name: 'alternate_titles' });
  const { fields: authors, append: addAuthor, remove: removeAuthor } = useFieldArray({ control, name: 'authors' });
  const { fields: genres, append: addGenre, remove: removeGenre } = useFieldArray({ control, name: 'genres' });
  const { fields: characters, append: addCharacter, remove: removeCharacter } = useFieldArray({ control, name: 'main_characters' });

  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const onSubmit = async (data) => {
    try {
      let uploadedUrl = '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await axios.post('http://localhost:5000/api/images/upload', formData);
        uploadedUrl = response.data.imageUrl;
      }

      const newBook = {
        ...data,
        picture_url: uploadedUrl,
      };

      await axios.post('http://localhost:5000/api/books', newBook);

      Swal.fire('Success!', 'Book added successfully', 'success');
      reset();
      setImageFile(null);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to add book', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Book</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Title */}
        <label className="block font-medium">Title</label>
        <input {...register('title', { required: true })} className="input" />

        {/* Origin Country */}
        <label className="block font-medium mt-4">Origin Country</label>
        <input {...register('origin_country', { required: true })} className="input" />

        {/* Description */}
        <label className="block font-medium mt-4">Description</label>
        <textarea {...register('description')} className="input" />

        {/* Alternate Titles */}
        <label className="block font-medium mt-4">Alternate Titles</label>
        {altTitles.map((_, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input {...register(`alternate_titles.${index}`)} className="input" />
            <button type="button" onClick={() => removeAltTitle(index)}>❌</button>
          </div>
        ))}
        <button type="button" onClick={() => addAltTitle('')} className="btn">+ Add Alternate Title</button>

        {/* Authors */}
        <label className="block font-medium mt-4">Authors</label>
        {authors.map((_, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input {...register(`authors.${index}`)} className="input" />
            <button type="button" onClick={() => removeAuthor(index)}>❌</button>
          </div>
        ))}
        <button type="button" onClick={() => addAuthor('')} className="btn">+ Add Author</button>

        {/* Genres */}
        <label className="block font-medium mt-4">Genres</label>
        {genres.map((_, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input {...register(`genres.${index}`)} className="input" />
            <button type="button" onClick={() => removeGenre(index)}>❌</button>
          </div>
        ))}
        <button type="button" onClick={() => addGenre('')} className="btn">+ Add Genre</button>

        {/* Main Characters */}
        <label className="block font-medium mt-4">Main Characters</label>
        {characters.map((_, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
            <input placeholder="Name" {...register(`main_characters.${index}.name`)} className="input" />
            <input placeholder="Picture URL" {...register(`main_characters.${index}.picture_url`)} className="input" />
            <input placeholder="Role" {...register(`main_characters.${index}.role`)} className="input" />
            <button type="button" onClick={() => removeCharacter(index)} className="col-span-3 text-sm text-red-500 mt-1">Remove Character</button>
          </div>
        ))}
        <button type="button" onClick={() => addCharacter({ name: '', picture_url: '', role: '' })} className="btn mt-2">+ Add Character</button>

        {/* Meta Fields */}
        <label className="block font-medium mt-4">Publication Period</label>
        <input {...register('meta.publication_period')} className="input" />

        <label className="block font-medium mt-4">Status</label>
        <input {...register('meta.status')} className="input" />

        {/* Cover Image URL */}
        <div className="mb-4">
          <label className="block font-medium">Cloudinary Image URL</label>
          <input
            type="text"
            {...register('picture_url')}
            placeholder="Paste Cloudinary image URL"
            className="input"
          />
        </div>
              
        {/* File Upload */}
        <div className="mb-4">
          <label className="block font-medium">Upload New Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="input"
          />
        </div>


        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded">Submit</button>
      </form>
    </div>
  );
};

export default AddBook;
