package com.service;

import com.entity.Scenes;
import com.repository.ScenesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScenesService {
    @Autowired
    ScenesRepository scenesRepository;

    public String getNameByID(Long id){
        return scenesRepository.getOne(id).getName();
    }

    public String getSettingByID(Long id){
        return scenesRepository.getOne(id).getSettings();
    }

    public String getTitleByID(Long id){
        return scenesRepository.getOne(id).getTitle();
    }

    public Scenes getByID(Long id) {
        return scenesRepository.getOne(id);
    }

    public List<Scenes> findAll() {
        return scenesRepository.findAll();
    }


}
