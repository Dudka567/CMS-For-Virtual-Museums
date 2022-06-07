package com.repository;

import com.entity.Scenes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScenesRepository extends JpaRepository<Scenes, Long> {
}
