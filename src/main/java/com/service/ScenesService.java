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

    public Scenes addScene(String settings, String name, String title){
        Scenes newScene = new Scenes(title, settings, name);
        scenesRepository.save(newScene);
        return newScene;
    }

    public Scenes saveScene(Long id,String settings, String name, String title){
        Scenes newScene = new Scenes(id, title, settings, name);
        scenesRepository.save(newScene);
        return newScene;
    }

    public void deleteScene(Long id,String settings, String name, String title){
        Scenes newScene = new Scenes(id, title, settings, name);
        scenesRepository.delete(newScene);
    }

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
