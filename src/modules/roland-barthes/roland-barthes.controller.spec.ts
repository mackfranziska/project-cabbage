import { Test, TestingModule } from '@nestjs/testing';
import { RolandBarthesController } from './roland-barthes.controller';
import { RolandBarthesService } from './roland-barthes.service';
import { S3Service } from '../../shared/services/s3.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AskHimResponse } from './models/ask-roland.models';
import { AskHimDTO } from './dto/ask-him.dto';
import { BadRequestException } from '@nestjs/common';
import { REQUESTS_DIR } from '../../shared/constants';

describe('RolandBarthesController', () => {
  let controller: RolandBarthesController;

  const rolandService = {
    askHim: jest.fn(),
  };
  const s3Service = {
    uploadFile: jest.fn(),
    getAllFilesInFolder: jest.fn(),
    getFilesInFolderAfterLatest: jest.fn(),
  };

  const logger = {
    error: jest.fn(),
    info: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolandBarthesController],
      providers: [
        {
          provide: RolandBarthesService,
          useValue: rolandService,
        },
        {
          provide: S3Service,
          useValue: s3Service,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    controller = module.get<RolandBarthesController>(RolandBarthesController);
  });

  beforeEach(() => {
    rolandService.askHim.mockClear();
    s3Service.uploadFile.mockClear();
  });

  const data: AskHimDTO = {
    input: 'Test, 1, 2, 3...',
    name: 'Sohee',
  };
  const response: AskHimResponse = { output: 'It is me, Roland!' };

  describe('askRoland', () => {
    it('should call process input and save discourse to S3', async () => {
      rolandService.askHim.mockImplementationOnce((request) => {
        expect(request).toMatchObject(data);
        return response;
      });

      await controller.askRoland(data);

      expect(rolandService.askHim).toHaveBeenCalledTimes(1);
      expect(s3Service.uploadFile).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from RolandBarthesService', async () => {
      rolandService.askHim.mockImplementationOnce(() => {
        throw new BadRequestException();
      });

      await expect(controller.askRoland(data)).rejects.toThrow();

      expect(rolandService.askHim).toHaveBeenCalledTimes(1);
      expect(s3Service.uploadFile).not.toHaveBeenCalled();
    });
  });

  describe('getHistory', () => {
    it('should return the history of discourse', async () => {
      const discourseHistoryMock = [{}, {}, {}];
      s3Service.getAllFilesInFolder.mockImplementationOnce(() =>
        Promise.resolve(discourseHistoryMock),
      );

      const result = await controller.getHistory();

      expect(result).toEqual(discourseHistoryMock);
      expect(s3Service.getAllFilesInFolder).toHaveBeenCalledWith(REQUESTS_DIR);
    });

    it('should propagate errors from S3Service', async () => {
      s3Service.getAllFilesInFolder.mockImplementationOnce(() =>
        Promise.reject(new BadRequestException()),
      );

      await expect(controller.getHistory()).rejects.toThrow(
        BadRequestException,
      );
      expect(s3Service.getAllFilesInFolder).toHaveBeenCalledWith(REQUESTS_DIR);
    });
  });

  describe('getLatestDiscourse', () => {
    const from = 'example.json';

    it('should return the latest discourse', async () => {
      const latestDiscourseMock = [{}, {}];
      s3Service.getFilesInFolderAfterLatest.mockImplementationOnce(() =>
        Promise.resolve(latestDiscourseMock),
      );

      const result = await controller.getLatestDiscourse(from);

      expect(result).toEqual(latestDiscourseMock);
      expect(s3Service.getFilesInFolderAfterLatest).toHaveBeenCalledWith(
        REQUESTS_DIR,
        `${REQUESTS_DIR}/${from}`,
      );
    });

    it('should propagate errors from S3Service', async () => {
      s3Service.getFilesInFolderAfterLatest.mockImplementationOnce(() =>
        Promise.reject(new BadRequestException()),
      );

      await expect(controller.getLatestDiscourse(from)).rejects.toThrow(
        BadRequestException,
      );
      expect(s3Service.getFilesInFolderAfterLatest).toHaveBeenCalledWith(
        REQUESTS_DIR,
        `${REQUESTS_DIR}/${from}`,
      );
    });
  });
});
