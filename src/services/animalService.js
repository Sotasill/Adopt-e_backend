import api from './api';

const ANIMAL_API_URLS = {
  registerAnimal: '/animals/register',
  checkBreederCode: '/animals/check-breeder-code',
  checkParent: '/animals/check-parent',
  getUserAnimals: '/animals/user',
  getAnimalById: '/animals',
  updateAnimal: '/animals',
  addTreatmentPost: '/animals/treatment-post',
  addNote: '/animals/note',
  getAllAnimals: '/animals',
  addToGallery: '/animals/gallery',
  getGallery: '/animals/gallery',
  deleteFromGallery: '/animals/gallery',
  setAsAvatar: '/animals/gallery/set-avatar',
  reorderGallery: '/animals/gallery/reorder',
};

export const animalService = {
  async registerAnimal(animalData) {
    const response = await api.post(ANIMAL_API_URLS.registerAnimal, animalData);
    return response.data;
  },

  async checkBreederCode(code) {
    const response = await api.post(ANIMAL_API_URLS.checkBreederCode, { code });
    return response.data;
  },

  async checkParent(parentId) {
    const response = await api.get(
      `${ANIMAL_API_URLS.checkParent}/${parentId}`
    );
    return response.data;
  },

  async getUserAnimals(filters = {}) {
    const queryParams = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 10,
      sortBy: filters.sortBy || 'registrationDate',
      sortOrder: filters.sortOrder || 'desc',
      ...(filters.type && { type: filters.type }),
      ...(filters.sex && { sex: filters.sex }),
      ...(filters.breed && { breed: filters.breed }),
      ...(filters.ageMin && { ageMin: filters.ageMin }),
      ...(filters.ageMax && { ageMax: filters.ageMax }),
      ...(filters.search && { search: filters.search }),
    });

    const response = await api.get(
      `${ANIMAL_API_URLS.getUserAnimals}?${queryParams}`
    );
    return response.data;
  },

  async getAnimalById(id) {
    const response = await api.get(`${ANIMAL_API_URLS.getAnimalById}/${id}`);
    return response.data;
  },

  async updateAnimal(id, updateData) {
    try {
      let config = {};
      let data = updateData;

      // Если updateData это FormData, устанавливаем правильный Content-Type
      if (updateData instanceof FormData) {
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      } else {
        // Если это обычный объект, создаем FormData
        const formData = new FormData();
        Object.keys(updateData).forEach(key => {
          if (updateData[key] instanceof File) {
            formData.append(key, updateData[key]);
          } else if (
            updateData[key] !== undefined &&
            updateData[key] !== null
          ) {
            formData.append(key, updateData[key]);
          }
        });
        data = formData;
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      }

      const response = await api.put(
        `${ANIMAL_API_URLS.updateAnimal}/${id}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error updating animal:', error);
      throw error;
    }
  },

  async deleteAnimal(id) {
    try {
      const response = await api.delete(
        `${ANIMAL_API_URLS.updateAnimal}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting animal:', error);
      throw error;
    }
  },

  async addTreatmentPost(animalId, formData) {
    try {
      const response = await api.post(
        `${ANIMAL_API_URLS.addTreatmentPost}/${animalId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding treatment post:', error);
      throw error;
    }
  },

  async addNote(animalId, formData) {
    try {
      const response = await api.post(
        `${ANIMAL_API_URLS.addNote}/${animalId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  },

  async getAllAnimals(filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 10,
        sortBy: filters.sortBy || 'registrationDate',
        sortOrder: filters.sortOrder || 'desc',
        ...(filters.type && { type: filters.type }),
        ...(filters.sex && { sex: filters.sex }),
        ...(filters.breed && { breed: filters.breed }),
        ...(filters.ageMin && { ageMin: filters.ageMin }),
        ...(filters.ageMax && { ageMax: filters.ageMax }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await api.get(
        `${ANIMAL_API_URLS.getAllAnimals}?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting all animals:', error);
      throw error;
    }
  },

  async addToGallery(animalId, formData) {
    try {
      const response = await api.post(
        `${ANIMAL_API_URLS.addToGallery}/${animalId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding images to gallery:', error);
      throw error;
    }
  },

  async getGallery(animalId) {
    try {
      const response = await api.get(
        `${ANIMAL_API_URLS.getGallery}/${animalId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting gallery:', error);
      throw error;
    }
  },

  async deleteFromGallery(animalId, imageId) {
    try {
      // Очищаем imageId от пути к папке, если он есть
      const cleanImageId = imageId.split('/').pop();

      const response = await api.delete(
        `${ANIMAL_API_URLS.deleteFromGallery}/${animalId}/${cleanImageId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting image from gallery:', error);
      throw error;
    }
  },

  async setImageAsAvatar(animalId, imageId) {
    try {
      const response = await api.put(
        `${ANIMAL_API_URLS.setAsAvatar}/${animalId}/${imageId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error setting image as avatar:', error);
      throw error;
    }
  },

  async reorderGallery(animalId, imageIds) {
    try {
      const response = await api.put(
        `${ANIMAL_API_URLS.reorderGallery}/${animalId}`,
        { imageIds }
      );
      return response.data;
    } catch (error) {
      console.error('Error reordering gallery:', error);
      throw error;
    }
  },
};

export default animalService;
