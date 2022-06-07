package com.controller;

import com.service.ScenesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ScenesController {
    @Autowired
    private ScenesService scenesService;

//    @RequestMapping(value = "/cms" , method = RequestMethod.POST, consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
//    @ResponseBody
//    public String getCMS(Scene scene) {
//        return scene.getId().toString();
//
//    }
}
