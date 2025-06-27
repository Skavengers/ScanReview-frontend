import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import getBaseUrl from '../../../utils/baseURL';
import Loading from '../../../components/Loading';

const UpdateBook = () => {
  const { id } = useParams();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      alternate_titles: [],
      authors: [],
      genres: [],
      main_characters: [],
      meta: { publication_period: '', status: '' }
    }
  });

  const {
    fields: altTitles,
    append: addAltTitle,
    remove: removeAltTitle
  } = useFieldArray({ control, name: 'alternate_titles' });

  const {
    fields: authors,
    append: addAuthor,
    remove: removeAuthor
  } = useFieldArray({ control, name: 'authors' });

  const {
    fields: genres,
    append: addGenre,
    remove: removeGenre
  } = useFieldArray({ control, name: 'genres' });

  const {
    fields: characters,
    append: addCharacter,
    remove: removeCharacter
  } = useFieldArray({ control, name: 'main_characters' });

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${getBaseUrl()}/api/books/${id}`);
        const data = res.data;
        reset(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };
    fetchBook();
  }, [id, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      let finalImageUrl = formData.picture_url; // default to manual entry

      // If file is selected, override it by uploading
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        const uploadRes = await axios.post(
          `${getBaseUrl()}/api/images/upload`,
          imageFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        finalImageUrl = uploadRes.data.imageUrl;
      }

      const updatedBook = {
        ...formData,
        picture_url: finalImageUrl,
      };

      await axios.put(`${getBaseUrl()}/api/books/edit/${id}`, updatedBook, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Swal.fire('Updated!', 'Book updated successfully.', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update book.', 'error');
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Update Book</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <label className="block font-medium">Title</label>
        <input {...register('title')} className="input" />

        <label className="block font-medium mt-4">Origin Country</label>
        <input {...register('origin_country')} className="input" />

        <label className="block font-medium mt-4 ">Description</label>
        <textarea {...register('description')} className="input mr-6 bg-gray-100" />

        {/* Alternate Titles */}
        <label className="block font-medium mt-4">Alternate Titles</label>
        {altTitles.map((_, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input {...register(`alternate_titles.${index}`)} className="input" />
            <button type="button" onClick={() => removeAltTitle(index)}>❌</button>
          </div>
        ))}
        <button type="button" onClick={() => addAltTitle('')} className="btn">+ Add</button>

        {/* Authors */}
        <label className="block font-medium mt-4">Authors</label>
        {authors.map((_, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input {...register(`authors.${index}`)} className="input" />
            <button type="button" onClick={() => removeAuthor(index)}>❌</button>
          </div>
        ))}
        <button type="button" onClick={() => addAuthor('')} className="btn">+ Add</button>

        {/* Genres */}
        <label className="block font-medium mt-4">Genres</label>
        {genres.map((_, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input {...register(`genres.${index}`)} className="input" />
            <button type="button" onClick={() => removeGenre(index)}>❌</button>
          </div>
        ))}
        <button type="button" onClick={() => addGenre('')} className="btn">+ Add</button>

        {/* Characters */}
        <label className="block font-medium mt-4">Main Characters</label>
        {characters.map((_, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
            <input placeholder="Name" {...register(`main_characters.${index}.name`)} className="input" />
            <input placeholder="Picture URL" {...register(`main_characters.${index}.picture_url`)} className="input" />
            <input placeholder="Role" {...register(`main_characters.${index}.role`)} className="input" />
            <button type="button" onClick={() => removeCharacter(index)} className="col-span-3 text-sm text-red-500 mt-1">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addCharacter({ name: '', picture_url: '', role: '' })} className="btn mt-2">+ Add Character</button>

        {/* Meta */}
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

        <button type="submit" className="w-full py-2 bg-blue-600 text-white mt-4 rounded">
          {loading ? 'Updating...' : 'Update Book'}
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
